import { Test, TestingModule } from '@nestjs/testing';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseService } from '../response/response.service';
import { findFirstWithOrg } from '../member/member.mock';
import { SessionService } from '../session/session.service';
import {
  findFirst as trackerFindFirst,
  trackerPostBodyMock,
  trackerPutBodyMock,
} from './tracker.mocks';
import { findFirst as clientFindFirst } from '../client/client.mock';
import { SchedulerRegistry } from '@nestjs/schedule';
import { NotFoundException } from '@nestjs/common';

describe('TrackerController', () => {
  let trackerController: TrackerController;
  let prisma: PrismaService;
  let formatter: ResponseService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TrackerController],
      providers: [
        TrackerService,
        PrismaService,
        ResponseService,
        SessionService,
        SchedulerRegistry,
      ],
    }).compile();

    trackerController = app.get<TrackerController>(TrackerController);
    prisma = app.get<PrismaService>(PrismaService);
    formatter = app.get<ResponseService>(ResponseService);
  });

  describe('read', () => {
    describe('positive', () => {
      it('should return all trackers back, aka an array', async () => {
        const response = [trackerFindFirst];
        prisma.tracker.findMany = jest.fn().mockReturnValueOnce(response);

        const result = await trackerController.read(
          { ...findFirstWithOrg },
          6,
          2023,
        );
        expect(result).toMatchObject(formatter.formatSuccess(response));
        expect(result.data).toHaveLength(1);
        expect(result.data[0]).toMatchObject(trackerFindFirst);
      });
    });
  });

  describe('create', () => {
    describe('positive', () => {
      it('should return tracker response if client is found in organization', async () => {
        const response = { ...trackerFindFirst };
        prisma.client.findFirst = jest
          .fn()
          .mockResolvedValue({ ...clientFindFirst });

        prisma.tracker.create = jest.fn().mockResolvedValue(response);
        const result = await trackerController.create(
          { ...findFirstWithOrg },
          { ...trackerPostBodyMock },
        );

        expect(result).toMatchObject(formatter.formatSuccess(response));
      });
    });

    describe('negative', () => {
      it('should throw Not found exception if cant client is found in organization', async () => {
        const response = { ...trackerFindFirst };
        prisma.client.findFirst = jest.fn().mockResolvedValue(null);

        prisma.tracker.create = jest.fn().mockRejectedValue(response);

        await expect(
          trackerController.create(
            { ...findFirstWithOrg },
            { ...trackerPostBodyMock },
          ),
        ).rejects.toThrowError(NotFoundException);
      });
    });
  });

  describe('update', () => {
    describe('positive', () => {
      it('should return newly updated tracker response if client is found in organization', async () => {
        const response = { ...trackerFindFirst };
        prisma.tracker.updateMany = jest.fn().mockResolvedValue({ count: 1 });
        prisma.tracker.findMany = jest.fn().mockResolvedValue([response]);

        const result = await trackerController.update(
          { ...findFirstWithOrg },
          response.id,
          undefined,
          { ...trackerPutBodyMock },
        );

        expect(result).toMatchObject(formatter.formatSuccess([response]));
      });
    });

    describe('negative', () => {
      it('should throw Not found exception if cant client is found in organization', async () => {
        const response = { ...trackerFindFirst };
        prisma.tracker.updateMany = jest.fn().mockResolvedValue({ count: 0 });
        prisma.tracker.findMany = jest.fn().mockResolvedValue([response]);

        await expect(
          trackerController.update(
            { ...findFirstWithOrg },
            response.id,
            undefined,
            { ...trackerPutBodyMock },
          ),
        ).rejects.toThrowError(NotFoundException);
      });
    });
  });

  describe('delete', () => {
    describe('positive', () => {
      it('should return newly tracker array response if client is found in organization', async () => {
        const response = { ...trackerFindFirst };
        prisma.tracker.deleteMany = jest.fn().mockResolvedValue({ count: 1 });
        prisma.tracker.findMany = jest.fn().mockResolvedValue([response]);

        const result = await trackerController.del(
          { ...findFirstWithOrg },
          response.id,
        );

        expect(result).toMatchObject(formatter.formatSuccess([response]));
      });
    });

    describe('negative', () => {
      it('should throw Not found exception if cant client is found in organization', async () => {
        const response = { ...trackerFindFirst };
        prisma.tracker.deleteMany = jest.fn().mockResolvedValue({ count: 0 });
        prisma.tracker.findMany = jest.fn().mockResolvedValue([response]);

        await expect(
          trackerController.del({ ...findFirstWithOrg }, response.id),
        ).rejects.toThrowError(NotFoundException);
      });
    });
  });

  describe('toggleOn', () => {
    describe('positive', () => {
      it('should return newly tracker array response if client is found in organization', async () => {
        const response = { ...trackerFindFirst };
        prisma.tracker.updateMany = jest.fn().mockResolvedValue({ count: 1 });
        prisma.tracker.findMany = jest.fn().mockResolvedValue([response]);

        const result = await trackerController.toggleOn(
          { ...findFirstWithOrg },
          response.id,
        );

        expect(result).toMatchObject(formatter.formatSuccess([response]));
      });
    });

    describe('negative', () => {
      it('should throw Not found exception if cant client is found in organization', async () => {
        const response = { ...trackerFindFirst };
        prisma.tracker.updateMany = jest.fn().mockResolvedValue({ count: 0 });
        prisma.tracker.findMany = jest.fn().mockResolvedValue([response]);

        await expect(
          trackerController.toggleOn({ ...findFirstWithOrg }, response.id),
        ).rejects.toThrowError(NotFoundException);
      });
    });
  });

  describe('toggleOff', () => {
    describe('positive', () => {
      it('should return newly tracker array response if client is found in organization', async () => {
        const response = { ...trackerFindFirst };
        prisma.tracker.findFirst = jest.fn().mockResolvedValue(response);
        prisma.tracker.update = jest.fn().mockResolvedValue(response);
        prisma.tracker.findMany = jest.fn().mockResolvedValue([response]);

        const result = await trackerController.toggleOff(
          { ...findFirstWithOrg },
          response.id,
        );

        expect(result).toMatchObject(formatter.formatSuccess([response]));
      });
    });

    describe('negative', () => {
      it('should throw Not found exception if cant client is found in organization', async () => {
        const response = { ...trackerFindFirst };
        prisma.tracker.findFirst = jest.fn().mockResolvedValue(null);
        prisma.tracker.update = jest.fn().mockResolvedValue(response);
        prisma.tracker.findMany = jest.fn().mockResolvedValue([response]);

        await expect(
          trackerController.toggleOff({ ...findFirstWithOrg }, response.id),
        ).rejects.toThrowError(NotFoundException);
      });
    });
  });
});
