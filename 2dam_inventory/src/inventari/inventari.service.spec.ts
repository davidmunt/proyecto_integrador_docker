import { Test, TestingModule } from '@nestjs/testing';
import { InventariService } from './inventari.service';
import { Inventari } from './inventari.entity';
import { UtilsService } from '../utils/utils.service';
import { getRepositoryToken } from '@nestjs/typeorm';

const oneInventari: Inventari = {
  id_inventory: 1,
  num_serie: 'ABC123',
  brand: 'Marca A',
  model: 'Modelo A',
  GVA_cod_article: 12345,
  GVA_description_cod_articulo: 'Descripción del artículo A',
  status: 'disponible',
  fk_inventary_type: {
    id_type: 1,
    description: 'Tipo A',
    fk_inventari: null,
  },
  fk_classroom: {
    id_classroom: 1,
    description: 'Aula 101',
    fk_inventari: null,
  },
  fk_issue: null,
};

const mockInventariUpdate: Inventari = {
  id_inventory: 1,
  num_serie: 'ABC123',
  brand: 'Marca A',
  model: 'Modelo A',
  GVA_cod_article: 12345,
  GVA_description_cod_articulo: 'Descripción del artículo A',
  status: 'disponible',
  fk_inventary_type: {
    id_type: 1,
    description: 'Tipo A',
    fk_inventari: null,
  },
  fk_classroom: {
    id_classroom: 1,
    description: 'Aula 101',
    fk_inventari: null,
  },
  fk_issue: null,
};

describe('InventariService', () => {
  let inventariService: InventariService;

  const MockInventariRepository = {
    find: jest.fn(() => [oneInventari]),
    findOne: jest.fn(() => oneInventari),
    create: jest.fn((inventari: Partial<Inventari>) => ({
      ...oneInventari,
      ...inventari,
    })),
    save: jest.fn((inventari: Partial<Inventari>) => ({
      ...oneInventari,
      ...inventari,
    })),
    update: jest.fn(() => Promise.resolve()),
    findOneBy: jest.fn((criteria) => {
      if (criteria.id_inventory === 1) {
        return Promise.resolve({ ...oneInventari, ...mockInventariUpdate });
      }
      return Promise.resolve(null);
    }),
    delete: jest.fn(() => Promise.resolve({ affected: 1 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventariService,
        UtilsService,
        {
          provide: getRepositoryToken(Inventari),
          useValue: MockInventariRepository,
        },
      ],
    }).compile();

    inventariService = module.get<InventariService>(InventariService);
  });

  it('should be defined', () => {
    expect(inventariService).toBeDefined();
  });

  describe('createInventari', () => {
    it('should create a new inventory item', async () => {
      const result = await inventariService.createInventari(oneInventari);
      expect(result).toEqual({ message: 'Inventario creado' });
      expect(MockInventariRepository.create).toHaveBeenCalledWith(oneInventari);
      expect(MockInventariRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateInventari', () => {
    it('should update an inventory item', async () => {
      const result = await inventariService.updateInventari(
        1,
        mockInventariUpdate,
      );
      expect(MockInventariRepository.update).toHaveBeenCalledWith(
        1,
        mockInventariUpdate,
      );
      expect(MockInventariRepository.findOneBy).toHaveBeenCalledWith({
        id_inventory: 1,
      });
      expect(result).toEqual({ ...oneInventari, ...mockInventariUpdate });
    });
  });

  describe('getInventariAll', () => {
    it('should return an array of inventaris', async () => {
      const result = await inventariService.getInventariAll('false');
      expect(result).toEqual([oneInventari]);
    });
  });

  describe('getInventari', () => {
    it('should return a specific inventari by ID', async () => {
      const result = await inventariService.getInventari(1, 'false');
      expect(result).toEqual(oneInventari);
      expect(MockInventariRepository.findOneBy).toHaveBeenCalledWith({
        id_inventory: 1,
      });
    });
  });

  describe('deleteInventari', () => {
    it('should delete an inventari successfully', async () => {
      const result = await inventariService.deleteInventari(1);
      expect(result).toEqual({ message: 'Inventario eliminado' });
      expect(MockInventariRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
