import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import databaseConfig from './database/config/database.config';
import appConfig from './config/app.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { ChatGroupsModule } from './chat-groups/chat-groups.module';
import { ChatGroupMembersModule } from './chat-group-members/chat-group-members.module';
import { MessagesModule } from './messages/messages.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthMeGuard } from './middleware/guards/auth-me.guard';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),

    infrastructureDatabaseModule,

    ChatGroupsModule,
    ChatGroupMembersModule,
    MessagesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthMeGuard,
    },
  ],
})
export class AppModule {}
