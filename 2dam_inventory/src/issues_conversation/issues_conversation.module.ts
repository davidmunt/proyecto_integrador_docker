import { Module } from '@nestjs/common';
import { IssueConversationController } from './issues_conversation.controller';
import { IssueConversationService } from './issues_conversation.service';
import { UtilsModule } from '../utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueConversationEntity } from './issues_conversation.entity';
@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([IssueConversationEntity])],
  controllers: [IssueConversationController],
  providers: [IssueConversationService],
})
export class IssuesConversationModule {}
