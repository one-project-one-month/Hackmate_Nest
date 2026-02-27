import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatGroupEntity } from '../../../../../chat-groups/infrastructure/persistence/relational/entities/chat-group.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
    name: 'messaging_messages',
})
export class MessageEntity extends EntityRelationalHelper {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @ManyToOne(() => ChatGroupEntity, {
        eager: true,
    })
    @JoinColumn({ name: 'group_id' })
    group: ChatGroupEntity;

    @Column({ type: 'bigint', name: 'sender_user_id' })
    senderUserId: number;

    @Column({ type: 'text' })
    body: string;

    @Column({ type: 'varchar', length: 50, default: 'text', name: 'message_type' })
    messageType: string;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any> | null;

    @Column({ type: 'timestamp', nullable: true, name: 'edited_at' })
    editedAt: Date | null;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
