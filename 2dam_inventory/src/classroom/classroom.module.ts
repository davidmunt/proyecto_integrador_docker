import { Module } from '@nestjs/common';
import { ClassroomController } from './classroom.controller';
import { ClassroomService } from './classroom.service';
import { UtilsModule } from '../utils/utils.module';
import { Classroom } from './classroom.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsService } from '../utils/utils.service';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([Classroom])],
  controllers: [ClassroomController],
  providers: [ClassroomService, UtilsService],
  exports: [ClassroomService],
})
export class ClassroomModule {}
