import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseService } from '../response/response.service';
import { findFirst } from './organization.mock';
import { findFirst as findFirstMember } from '../member/member.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { getSessionMock } from '../session/session.mock';
import { SessionService } from '../session/session.service';
import { SchedulerRegistry } from '@nestjs/schedule';

describe('OrganizationController', () => {
  let organizationController: OrganizationController;
  let prisma: PrismaService;
  let formatter: ResponseService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      providers: [
        OrganizationService,
        PrismaService,
        ResponseService,
        SessionService,
        SchedulerRegistry,
      ],
    }).compile();

    organizationController = app.get<OrganizationController>(
      OrganizationController,
    );
    prisma = app.get<PrismaService>(PrismaService);
    formatter = app.get<ResponseService>(ResponseService);
  });

  describe('read', () => {
    describe('positive', () => {
      it('should return all organizations, aka an array', async () => {
        const response = [];
        prisma.organization.findMany = jest.fn().mockReturnValueOnce([]);
        prisma.session.findFirst = jest
          .fn()
          .mockReturnValueOnce({ member: findFirstMember });
        await expect(
          organizationController.read(
            getSessionMock({ get: { id: 'test id' } }),
          ),
        ).resolves.toMatchObject(formatter.formatSuccess(response));
      });

      it('should return find organizations with id', async () => {
        const response = formatter.formatSuccess(findFirst);
        prisma.organization.findFirst = jest
          .fn()
          .mockReturnValueOnce(findFirst);
        prisma.session.findFirst = jest
          .fn()
          .mockReturnValueOnce({ member: findFirstMember });
        await expect(
          organizationController.read(
            getSessionMock({ get: { id: 'test id' } }),
            findFirst.id,
          ),
        ).resolves.toMatchObject(response);
      });
    });

    describe('negative', () => {
      it('should throw a bad request if we cannot find a organization by id', async () => {
        prisma.organization.findFirst = jest.fn().mockReturnValueOnce(null);
        prisma.session.findFirst = jest
          .fn()
          .mockReturnValueOnce({ member: findFirstMember });

        await expect(
          organizationController.read(
            getSessionMock({ get: { id: 'test id' } }),
            findFirst.id,
          ),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('create', () => {
    describe('positive', () => {
      it('should return back formatted success on create', async () => {
        prisma.organization.create = jest.fn().mockReturnValueOnce(findFirst);

        await expect(
          organizationController.create(randomUUID(), {
            name: findFirst.name,
          }),
        ).resolves.toMatchObject(formatter.formatSuccess(findFirst));
      });
    });

    describe('negative', () => {
      it('should throw bad request if prisma fails', async () => {
        prisma.organization.create = jest.fn().mockReturnValueOnce(null);

        await expect(
          organizationController.create(randomUUID(), { name: findFirst.name }),
        ).rejects.toThrow(BadRequestException);
      });
    });
  });

  describe('update', () => {
    describe('positive', () => {
      it('should return success response when update operation is expected', async () => {
        const data = { ...findFirst, name: 'project finance' };
        prisma.organization.update = jest.fn().mockReturnValueOnce(data);

        await expect(
          organizationController.update(findFirst.id, randomUUID(), {
            name: 'project finance',
          }),
        ).resolves.toMatchObject(formatter.formatSuccess(data));
      });
    });

    describe('negative', () => {
      it('should throw bad request if prisma returns null', async () => {
        prisma.organization.update = jest.fn().mockReturnValueOnce(null);

        await expect(
          organizationController.update(findFirst.id, randomUUID(), {
            name: 'project finance',
          }),
        ).rejects.toThrow(BadRequestException);
      });
    });
  });

  describe('delete', () => {
    describe('positive', () => {
      it('should return true if successfully deleted', async () => {
        prisma.organization.deleteMany = jest
          .fn()
          .mockReturnValueOnce({ count: 1 });

        await expect(
          organizationController.del(findFirst.id, randomUUID()),
        ).resolves.toMatchObject(formatter.formatSuccess(true));
      });
    });

    describe('negative', () => {
      it('should reject if deleted count is 0', async () => {
        prisma.organization.deleteMany = jest
          .fn()
          .mockReturnValueOnce({ count: 0 });

        await expect(
          organizationController.del(findFirst.id, randomUUID()),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });
});
