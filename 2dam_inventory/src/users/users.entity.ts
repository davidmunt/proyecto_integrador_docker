import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IssueConversationEntity } from '../issues_conversation/issues_conversation.entity';
import { Issue } from '../issues/issues.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ default: 0 })
  role: number;

  @OneToMany(
    () => IssueConversationEntity,
    (issueConversation) => issueConversation.user,
  )
  @JoinColumn()
  issueConversations: IssueConversationEntity[];

  @OneToMany(() => Issue, (issue) => issue.id_issue)
  issues: Issue[];

  @OneToMany(() => Issue, (issue) => issue.technician)
  assignedIssues: Issue[];
}
