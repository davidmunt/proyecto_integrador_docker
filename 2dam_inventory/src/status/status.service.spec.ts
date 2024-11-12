import { Test, TestingModule } from '@nestjs/testing';
import { StatusService } from './status.service';
import { Status } from './status.entity';
import { UtilsService } from '../utils/utils.service';
import { getRepositoryToken } from '@nestjs/typeorm';

const statusArray = [
  {
    description: 'Eliminada',
    issues: [],
  },
  {
    description: 'Creada',
    issues: [],
  },
  {
    description: 'Creada',
    issues: [],
  },
];

const oneStatus = {
  description: 'Eliminada',
  issues: [],
};

describe('StatusService', () => {
  let statusService: StatusService;
  const MockStatusRepository = {
    find: jest.fn(() => Promise.resolve(statusArray)),
    findOneBy: jest.fn((criteria) => {
      if (criteria.id_status === 1) {
        return Promise.resolve(oneStatus);
      }
      return Promise.resolve(null);
    }),
    create: jest.fn((status) => status),
    save: jest.fn((status) => Promise.resolve(status)),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve({ affected: 1 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusService,
        UtilsService,
        {
          provide: getRepositoryToken(Status),
          useValue: MockStatusRepository,
        },
      ],
    }).compile();

    statusService = module.get<StatusService>(StatusService);
  });

  it('should be defined', () => {
    expect(statusService).toBeDefined();
  });

  describe('getAllStatus', () => {
    it('should return an array of statuses', async () => {
      const result = await statusService.getAllStatus('false');
      expect(result).toEqual(statusArray);
      expect(MockStatusRepository.find).toHaveBeenCalled();
    });
  });

  describe('getStatus', () => {
    it('should return a single status by ID', async () => {
      const result = await statusService.getStatus(1, 'false');
      expect(result).toEqual(oneStatus);
      expect(MockStatusRepository.findOneBy).toHaveBeenCalledWith({
        id_status: 1,
      });
    });

    it('should throw an exception if status not found', async () => {
      await expect(statusService.getStatus(999, 'false')).rejects.toThrow();
    });
  });

  describe('createStatus', () => {
    it('should create a new status', async () => {
      const newStatus = {
        description: 'En progreso',
      };
      const result = await statusService.createStatus(newStatus);
      expect(result).toEqual({ message: 'Status creado con éxito' });
      expect(MockStatusRepository.create).toHaveBeenCalledWith(newStatus);
      expect(MockStatusRepository.save).toHaveBeenCalledWith(newStatus);
    });
  });

  describe('updateStatus', () => {
    it('should update an existing status', async () => {
      const updatedStatus = {
        id_status: 1,
        description: 'Actualizada',
        issues: [],
      };
      await statusService.updateStatus(updatedStatus);
      expect(MockStatusRepository.update).toHaveBeenCalledWith(
        updatedStatus.id_status,
        updatedStatus,
      );
      expect(MockStatusRepository.findOneBy).toHaveBeenCalledWith({
        id_status: updatedStatus.id_status,
      });
    });

    it('should throw an exception if status to update is not found', async () => {
      const updatedStatus = {
        id_status: 999,
        description: 'No existe',
        issues: [],
      };
      await expect(statusService.updateStatus(updatedStatus)).rejects.toThrow();
    });
  });

  describe('deleteStatus', () => {
    it('should delete a status by ID', async () => {
      await statusService.deleteStatus(1);
      expect(MockStatusRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if status to delete is not found', async () => {
      MockStatusRepository.delete.mockResolvedValueOnce({ affected: 0 });
      await expect(statusService.deleteStatus(999)).rejects.toThrow();
    });
  });
});
