import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { Status } from './status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StatusService {
  constructor(
    private readonly UtilsService: UtilsService,
    @InjectRepository(Status) private statusRepository: Repository<Status>,
  ) {}

  async getAllStatus(xml: string): Promise<Status[] | string> {
    const allStatus = await this.statusRepository.find();
    if (xml === 'true') {
      const jsonForXml = JSON.stringify({ Status: allStatus });
      return this.UtilsService.convertJSONtoXML(jsonForXml);
    }
    return allStatus;
  }

  async createStatus(status: any): Promise<{ message: string }> {
    const newStatus = this.statusRepository.create(status);
    await this.statusRepository.save(newStatus);
    return { message: 'Status creado con éxito' };
  }

  async getStatus(id: number, xml: string): Promise<Status | string> {
    const status = await this.statusRepository.findOneBy({ id_status: id });
    if (status) {
      if (xml === 'true') {
        const jsonForXml = JSON.stringify({ Status: status });
        return this.UtilsService.convertJSONtoXML(jsonForXml);
      }
      return status;
    } else {
      throw new HttpException('No encontrado', HttpStatus.NOT_FOUND);
    }
  }

  async updateStatus(statusUpdated: Status): Promise<Status> {
    const existingStatus = await this.statusRepository.findOneBy({
      id_status: statusUpdated.id_status,
    });
    if (!existingStatus) {
      throw new HttpException('Status no encontrado', HttpStatus.NOT_FOUND);
    }
    await this.statusRepository.update(statusUpdated.id_status, statusUpdated);
    return await this.statusRepository.findOneBy({
      id_status: statusUpdated.id_status,
    });
  }

  async deleteStatus(id: number): Promise<void> {
    const result = await this.statusRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('No encontrado', HttpStatus.NOT_FOUND);
    }
  }
}
