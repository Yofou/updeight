import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseService } from '../response/response.service';
import { findFirst } from './client.mock';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from 'prisma';

describe('ClientController', () => {
  let clientController: ClientController;
  let prisma: PrismaService;
  let formater: ResponseService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [ClientService, PrismaService, ResponseService],
    }).compile();

    clientController = app.get<ClientController>(ClientController);
    prisma = app.get<PrismaService>(PrismaService);
    formater = app.get<ResponseService>(ResponseService);
  });

  describe('read', () => {
    describe('positive', () => {
      it('should return all clients, aka an array', async () => {
        const response = [];
        prisma.client.findMany = jest.fn().mockReturnValueOnce([]);
        await expect(clientController.read()).resolves.toMatchObject(
          formater.formatSucces(response),
        );
      });

      it('should return find clients with id', async () => {
        const response = formater.formatSucces(findFirst);
        prisma.client.findFirst = jest.fn().mockReturnValueOnce(findFirst);
        await expect(
          clientController.read(findFirst.id),
        ).resolves.toMatchObject(response);
      });
    });

    describe('negative', () => {
      it('should throw a bad request if we cannot find a orgnaization by id', async () => {
        prisma.client.findFirst = jest.fn().mockReturnValueOnce(null);

        await expect(clientController.read(findFirst.id)).rejects.toThrow(
          BadRequestException,
        );
      });
    });
  });

  describe('create', () => {
    describe('positive', () => {
      it('should return back formated success on create', async () => {
        prisma.client.create = jest.fn().mockReturnValueOnce(findFirst);

        await expect(
          clientController.create(randomUUID(), {
            name: findFirst.name,
            organizationId: randomUUID(),
            thumbnail: 'rick roll',
          }),
        ).resolves.toMatchObject(formater.formatSucces(findFirst));
      });
    });

    describe('negative', () => {
      it('should throw bad request if prisma fails', async () => {
        prisma.client.create = jest
          .fn()
          .mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError(
              'this is an error message',
              { code: 'P-000', clientVersion: 'mock' },
            ),
          );

        await expect(
          clientController.create(randomUUID(), {
            name: findFirst.name,
            organizationId: randomUUID(),
            thumbnail: 'rick roll',
          }),
        ).rejects.toThrow(Prisma.PrismaClientKnownRequestError);
      });
    });
  });

  describe('update', () => {
    describe('positive', () => {
      it('should return success response when update operation is expected', async () => {
        const data = { ...findFirst, name: 'project finance' };
        prisma.client.update = jest.fn().mockReturnValueOnce(data);
        prisma.organization.count = jest.fn().mockReturnValueOnce(1);
        prisma.client.findFirst = jest
          .fn()
          .mockReturnValueOnce(findFirst.organization);

        await expect(
          clientController.update(findFirst.id, randomUUID(), {
            name: 'project finance',
            thumbnail: 'rich roll',
          }),
        ).resolves.toMatchObject(formater.formatSucces(data));
      });
    });

    describe('negative', () => {
      it('should throw bad request if prisma returns null', async () => {
        prisma.client.update = jest
          .fn()
          .mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError(
              'this is an error message',
              { code: 'P-000', clientVersion: 'mock' },
            ),
          );
        prisma.organization.count = jest.fn().mockReturnValueOnce(1);
        prisma.client.findFirst = jest
          .fn()
          .mockReturnValueOnce(findFirst.organization);

        await expect(
          clientController.update(findFirst.id, randomUUID(), {
            name: 'project finance',
            thumbnail: 'rick roll',
          }),
        ).rejects.toThrow(Prisma.PrismaClientKnownRequestError);
      });
    });
  });

  describe('delete', () => {
    describe('positive', () => {
      it('should return true if succesfully deleted', async () => {
        prisma.client.deleteMany = jest.fn().mockReturnValueOnce({ count: 1 });

        await expect(
          clientController.del(findFirst.id, randomUUID()),
        ).resolves.toMatchObject(formater.formatSucces(true));
      });
    });

    describe('negative', () => {
      it('should reject if deleted count is 0', async () => {
        prisma.client.deleteMany = jest.fn().mockReturnValueOnce({ count: 0 });

        await expect(
          clientController.del(findFirst.id, randomUUID()),
        ).rejects.toThrow(BadRequestException);
      });
    });
  });
});
