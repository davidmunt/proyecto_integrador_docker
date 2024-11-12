import { Module } from '@nestjs/common';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { UtilsModule } from '../utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './issues.entity';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([Issue])],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
