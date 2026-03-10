import 'dotenv/config';
process.env.ALLOW_FAKE_AUTH = 'true';
export const APP_URL = `http://localhost:${process.env.APP_PORT || 3000}`;
