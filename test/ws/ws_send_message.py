import argparse
import json
import sys
import threading
import logging

import socketio

# Setup logging for better visibility
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Send a test message over Socket.IO and wait for broadcast.",
    )
    parser.add_argument("--base-url", default="http://localhost:3000")
    parser.add_argument("--group-id", type=int, required=True)
    parser.add_argument("--sender-user-id", type=int, default=1)
    parser.add_argument("--body", default="hello ws")
    parser.add_argument("--message-type", default="text")
    parser.add_argument("--timeout", type=int, default=10)
    parser.add_argument(
        "--retries",
        type=int,
        default=1,
        help="How many connection attempts to make.",
    )
    parser.add_argument(
        "--transport",
        choices=["polling", "websocket"],
        default="websocket",
        help="Socket.IO transport to use.",
    )
    parser.add_argument(
        "--socketio-path",
        default="/socket.io",
        help="Socket.IO path (default: /socket.io).",
    )
    parser.add_argument(
        "--metadata-json",
        default='{"source":"python"}',
        help="JSON string for message metadata.",
    )
    parser.add_argument(
        "--auth-token",
        default=None,
        help="Optional bearer token for Authorization header.",
    )
    parser.add_argument(
        "--listen",
        action="store_true",
        help="Keep listening for new messages until Ctrl+C.",
    )
    return parser.parse_args()

def main() -> int:
    args = parse_args()
    namespace = f"/v1/ws/{args.group_id}"
    sio = socketio.Client(logger=False, engineio_logger=False)

    done_event = threading.Event()
    success = False
    disconnected_early = False

    try:
        metadata = json.loads(args.metadata_json)
        if not isinstance(metadata, dict):
            raise ValueError("metadata-json must decode to an object")
    except Exception as exc:
        logger.error(f"Invalid --metadata-json: {exc}")
        return 1

    @sio.event(namespace=namespace)
    def connect():
        logger.info(f"Connected to namespace: {namespace}")
        payload = {
            "senderUserId": args.sender_user_id,
            "body": args.body,
            "messageType": args.message_type,
            "metadata": metadata,
        }
        logger.info(f"Emitting message:send -> {payload}")
        sio.emit("message:send", payload, namespace=namespace, callback=on_ack)

    def on_ack(data):
        logger.info(f"Received ack from server: {data}")

    @sio.on("message:new", namespace=namespace)
    def on_message(data):
        logger.info(f"Received message:new! Data: {data}")
        nonlocal success
        success = True
        if not args.listen:
            done_event.set()

    @sio.event(namespace=namespace)
    def connect_error(data):
        logger.error(f"Connection error: {data}")
        done_event.set()

    @sio.event(namespace=namespace)
    def disconnect():
        logger.warning("Disconnected from server")
        nonlocal disconnected_early
        if not success:
            disconnected_early = True
        done_event.set()

    headers = {}
    if args.auth_token:
        headers["Authorization"] = f"Bearer {args.auth_token}"

    attempts = max(1, args.retries)
    for attempt in range(1, attempts + 1):
        done_event.clear()
        success = False
        disconnected_early = False

        try:
            logger.info(f"Connecting to {args.base_url} (attempt {attempt}/{attempts})...")
            sio.connect(
                args.base_url,
                namespaces=[namespace],
                transports=[args.transport],
                socketio_path=args.socketio_path,
                wait_timeout=args.timeout,
                headers=headers or None,
            )

            if args.listen:
                logger.info("Listening for message:new events. Press Ctrl+C to stop.")
                try:
                    sio.wait()
                except KeyboardInterrupt:
                    logger.info("Stopped by user.")
                return 0

            if not done_event.wait(timeout=args.timeout):
                logger.error("Timed out waiting for message:new")
            elif success:
                return 0
            elif disconnected_early:
                logger.error("Disconnected before receiving message:new")
            else:
                logger.error("Did not receive message:new")

        except Exception as e:
            logger.error(f"Failed to connect or execute: {e}")
        finally:
            if sio.connected:
                sio.disconnect()

    return 1

if __name__ == "__main__":
    sys.exit(main())
