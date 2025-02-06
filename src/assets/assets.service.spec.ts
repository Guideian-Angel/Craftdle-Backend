import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AssetsService', () => {
  let service: AssetsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetsService,
        {
          provide: PrismaService,
          useValue: {
            profile_pictures: { findMany: jest.fn() },
            profile_borders: { findMany: jest.fn() },
            collections: { findMany: jest.fn() },
            achievements: { findMany: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<AssetsService>(AssetsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getAllProfilePictures', () => {
    it('should return all profile pictures', async () => {
      const mockData = [{ id: 1, name: 'picture1', src: 'picture1.png' }, { id: 2, name: 'picture2', src: 'picture2.png' }];
      jest.spyOn(prisma.profile_pictures, 'findMany').mockResolvedValue(mockData);

      const result = await service.getAllProfilePictures();
      expect(result).toEqual(mockData);
    });

    it('should throw an HttpException on error', async () => {
      jest.spyOn(prisma.profile_pictures, 'findMany').mockRejectedValue(new Error('Database error'));

      await expect(service.getAllProfilePictures()).rejects.toThrow(HttpException);
      await expect(service.getAllProfilePictures()).rejects.toThrow('Database error');
    });
  });

  describe('getAllProfileBorders', () => {
    it('should return all profile borders', async () => {
      const mockData = [{ id: 1, name: 'border1', src: 'border1.png' }, { id: 2, name: 'border2', src: 'border2.png' }];
      jest.spyOn(prisma.profile_borders, 'findMany').mockResolvedValue(mockData);

      const result = await service.getAllProfileBorders();
      expect(result).toEqual(mockData);
    });

    it('should throw an HttpException on error', async () => {
      jest.spyOn(prisma.profile_borders, 'findMany').mockRejectedValue(new Error('Database error'));

      await expect(service.getAllProfileBorders()).rejects.toThrow(HttpException);
      await expect(service.getAllProfileBorders()).rejects.toThrow('Database error');
    });
  });

  describe('getAllInventoryItems', () => {
    it('should return all inventory items', async () => {
      const mockData = [
        { id: 1, name: 'item1', src: 'item1.png', item_id: 'item1_id' },
        { id: 2, name: 'item2', src: 'item2.png', item_id: 'item2_id' }
      ];
      jest.spyOn(prisma.collections, 'findMany').mockResolvedValue(mockData);

      const result = await service.getAllInventoryItems();
      expect(result).toEqual(mockData);
    });

    it('should throw an HttpException on error', async () => {
      jest.spyOn(prisma.collections, 'findMany').mockRejectedValue(new Error('Database error'));

      await expect(service.getAllInventoryItems()).rejects.toThrow(HttpException);
      await expect(service.getAllInventoryItems()).rejects.toThrow('Database error');
    });
  });

  describe('getAllAchievements', () => {
    it('should return all achievements', async () => {
      const mockData = [
        { event: 'event1', id: 1, title: 'achievement1', description: 'desc1', icon: 'icon1.png', goal: 10, is_secret: false, parent: 0, target: 'target1' },
        { event: 'event2', id: 2, title: 'achievement2', description: 'desc2', icon: 'icon2.png', goal: 20, is_secret: true, parent: 1, target: 'target2' }
      ];
      jest.spyOn(prisma.achievements, 'findMany').mockResolvedValue(mockData);

      const result = await service.getAllAchievements();
      expect(result).toEqual(mockData);
    });

    it('should throw an HttpException on error', async () => {
      jest.spyOn(prisma.achievements, 'findMany').mockRejectedValue(new HttpException('Database error', HttpStatus.INTERNAL_SERVER_ERROR));

      await expect(service.getAllAchievements()).rejects.toThrow(HttpException);
      await expect(service.getAllAchievements()).rejects.toThrow('Database error');
    });
  });
});
