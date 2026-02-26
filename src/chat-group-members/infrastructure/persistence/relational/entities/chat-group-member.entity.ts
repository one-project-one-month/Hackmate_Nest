import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatGroupEntity } from '../../../../../chat-groups/infrastructure/persistence/relational/entities/chat-group.entity';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
    name: 'chat_group_members',
})
export class ChatGroupMemberEntity extends EntityRelationalHelper {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @ManyToOne(() => ChatGroupEntity, {
        eager: true,
    })
    @JoinColumn({ name: 'group_id' })
    group: ChatGroupEntity;

    @Column({ type: 'bigint', name: 'user_id' })
    userId: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    role: string | null;

    @CreateDateColumn({ name: 'joined_at' })
    joinedAt: Date;

    @Column({ type: 'bigint', nullable: true, name: 'last_read_message_id' })
    lastReadMessageId: number | null;

    @Column({ type: 'timestamp', nullable: true, name: 'muted_until' })
    mutedUntil: Date | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    status: string | null;
}
