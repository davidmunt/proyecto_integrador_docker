import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventari } from './inventari.entity';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class InventariService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(Inventari)
    private readonly inventariRepository: Repository<Inventari>,
  ) {}

  async getInventari(id?: number, xml?: string): Promise<any> {
    const result = await this.inventariRepository.findOneBy({
      id_inventory: id,
    });

    if (xml === 'true') {
      const jsonFormatted = JSON.stringify({
        Inventari: this.inventariRepository.find(),
      });
      const xmlResult = this.utilsService.convertJSONtoXML(jsonFormatted);
      return xmlResult;
    }

    return result;
  }

  async getInventariAll(xml?: string): Promise<any> {
    const result = await this.inventariRepository.find({
      relations: ['fk_inventary_type', 'fk_issue', 'fk_classroom'],
    });
    if (xml === 'true') {
      const jsonFormatted = JSON.stringify({
        Inventari: result,
      });
      const xmlResult = this.utilsService.convertJSONtoXML(jsonFormatted);
      return xmlResult;
    }

    return result;
  }

  async createInventari(
    inventari: Partial<Inventari>,
  ): Promise<{ message: string }> {
    const newInventari = this.inventariRepository.create(inventari);
    await this.inventariRepository.save(newInventari);
    return { message: 'Inventario creado' };
  }

  async updateInventari(id: number, inventari: Inventari): Promise<Inventari> {
    await this.inventariRepository.update(id, inventari);
    const updatedInventari = await this.inventariRepository.findOne({
      where: { id_inventory: id },
      relations: {
        fk_inventary_type: true,
        fk_issue: true,
        fk_classroom: true,
      },
    });
    if (!updatedInventari) {
      throw new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);
    }
    return updatedInventari;
  }

  async deleteInventari(id: number): Promise<{ message: string }> {
    const result = await this.inventariRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);
    }
    return { message: 'Inventario eliminado' };
  }
}
