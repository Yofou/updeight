import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseService } from '../response/response.service';
import { findFirst, findFirstWithOrg } from './member.mock';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  getSessionMock,
  findFirst as findFirstSession,
} from '../session/session.mock';
import { SessionModule } from '../session/session.module';
import { mockDeep } from 'jest-mock-extended';

describe('MemberController', () => {
  let memberController: MemberController;
  let prisma: PrismaService;
  let formatter: ResponseService;
  const baseMockSessionData = {
    get: { ...findFirstWithOrg },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [SessionModule],
      controllers: [MemberController],
      providers: [MemberService, PrismaService, ResponseService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    memberController = app.get<MemberController>(MemberController);
    prisma = app.get<PrismaService>(PrismaService);
    formatter = app.get<ResponseService>(ResponseService);
  });

  describe('read', () => {
    describe('positive', () => {
      it('should return members me', async () => {
        const response = {
          member: findFirst,
        };
        prisma.session.findFirst = jest.fn().mockReturnValueOnce(response);
        await expect(
          memberController.read({ ...findFirstWithOrg }),
        ).resolves.toMatchObject(formatter.formatSuccess(response.member));
      });

      it('should return find member with id', async () => {
        const response = formatter.formatSuccess(findFirst);
        prisma.session.findFirst = jest
          .fn()
          .mockReturnValueOnce({ member: findFirst });
        prisma.member.findFirst = jest.fn().mockReturnValueOnce(findFirst);
        await expect(
          memberController.read({ ...findFirstWithOrg }, findFirst.id),
        ).resolves.toMatchObject(response);
      });

      it('should return all the members from an organization', async () => {
        const response = formatter.formatSuccess([findFirst]);
        prisma.member.findFirst = jest.fn().mockReturnValue(findFirst);
        prisma.session.findFirst = jest
          .fn()
          .mockReturnValueOnce({ member: findFirst });
        prisma.member.findMany = jest.fn().mockReturnValueOnce([findFirst]);

        await expect(
          memberController.read(
            { ...findFirstWithOrg },
            undefined,
            '<organization-id>',
          ),
        ).resolves.toMatchObject(response);
      });
    });

    describe('negative', () => {
      it('should throw a bad request if we cannot find a member by id', async () => {
        prisma.session.findFirst = jest
          .fn()
          .mockReturnValueOnce({ member: findFirst });
        prisma.member.findFirst = jest.fn().mockReturnValue(null);

        await expect(
          memberController.read({ ...findFirstWithOrg }, findFirst.id),
        ).rejects.toThrow(BadRequestException);
      });

      it('should throw unauthorized if member is not apart of organization', async () => {
        prisma.member.findFirst = jest.fn().mockReturnValue(findFirst);
        prisma.session.findFirst = jest
          .fn()
          .mockReturnValueOnce({ member: findFirst });
        prisma.member.findMany = jest.fn().mockReturnValueOnce([]);

        await expect(
          memberController.read(
            { ...findFirstWithOrg },
            undefined,
            '<organization-id>',
          ),
        ).rejects.toThrow(UnauthorizedException);
      });
    });
  });

  describe('login', () => {
    describe('positive coverage:', () => {
      it('should login user', async () => {
        prisma.member.findFirst = jest.fn().mockReturnValueOnce({
          ...findFirst,
          password:
            '$argon2i$v=19$m=16,t=2,p=1$MTIzMTQxMjQz$4iN++FR8QH4JK/ALb2KZmQ',
        });
        prisma.session.create = jest
          .fn()
          .mockReturnValueOnce({ id: 'session-id', member: findFirst });
        prisma.session.deleteMany = jest.fn();

        expect(
          await memberController.login(
            getSessionMock(baseMockSessionData),
            undefined,
            {
              email: findFirst.email,
              password: 'secure password',
            },
          ),
        ).toMatchObject(formatter.formatSuccess(findFirst));
      });
    });

    describe('negative coverage:', () => {
      it('should throw member not found when no member is found by email', async () => {
        prisma.member.findFirst = jest.fn().mockReturnValueOnce(null);
        prisma.session.create = jest
          .fn()
          .mockReturnValueOnce({ id: 'session-id', member: findFirst });
        prisma.session.deleteMany = jest.fn();

        expect(
          memberController.login(
            getSessionMock(baseMockSessionData),
            undefined,
            {
              email: findFirst.email,
              password: 'secure password',
            },
          ),
        ).rejects.toThrow(NotFoundException);
      });

      it('should throw member not found when password fails', async () => {
        prisma.member.findFirst = jest.fn().mockReturnValueOnce({
          ...findFirst,
          password:
            '$argon2i$v=19$m=16,t=2,p=1$MTIzMTQxMjQz$4iN++FR8QH4JK/ALb2KZmQ',
        });
        prisma.session.create = jest
          .fn()
          .mockReturnValueOnce({ id: 'session-id', member: findFirst });
        prisma.session.deleteMany = jest.fn();

        expect(
          memberController.login(
            getSessionMock(baseMockSessionData),
            undefined,
            {
              email: findFirst.email,
              password: 'bad password',
            },
          ),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('logout', () => {
    describe('positive coverage:', () => {
      it('logout a user', () => {
        prisma.session.deleteMany = jest.fn();
        expect(
          memberController.logout(
            getSessionMock(baseMockSessionData),
            undefined,
          ),
        ).resolves.toMatchObject(formatter.formatSuccess(true));
      });
    });
  });

  describe('create', () => {
    describe('positive coverage', () => {
      it('should register a user and create a session', async () => {
        prisma.member.create = jest.fn().mockReturnValueOnce(findFirst);
        prisma.session.create = jest.fn().mockReturnValueOnce(findFirstSession);
        prisma.session.deleteMany = jest.fn();
        expect(
          await memberController.create(
            getSessionMock(baseMockSessionData),
            undefined,
            {
              email: findFirst.email,
              name: findFirst.name,
              password: 'secure password',
            },
          ),
        ).toMatchObject(formatter.formatSuccess(findFirst));
      });
    });
  });

  describe('update', () => {
    describe('positive coverage:', () => {
      it('should update a member', async () => {
        const updatedFindFirst = { ...findFirst, name: 'yofou321' };
        prisma.session.findFirst = jest
          .fn()
          .mockReturnValueOnce({ ...findFirstSession, member: findFirst });
        prisma.member.update = jest.fn().mockReturnValueOnce(updatedFindFirst);

        expect(
          await memberController.update(
            { ...findFirstWithOrg },
            findFirst.id,
            undefined,
            {
              name: updatedFindFirst.name,
            },
          ),
        ).toMatchObject(formatter.formatSuccess(updatedFindFirst));
      });
    });

    describe('negative coverage:', () => {
      it('should throw unauthorized if user is trying to update a different user', async () => {
        const updatedFindFirst = { ...findFirst, name: 'yofou321' };
        prisma.session.findFirst = jest.fn().mockReturnValueOnce({
          ...findFirstSession,
          member: { ...findFirstWithOrg, id: '<other-id>' },
        });
        prisma.member.update = jest.fn().mockReturnValueOnce(updatedFindFirst);

        expect(
          memberController.update(
            { ...findFirstWithOrg, id: '<other-id>' },
            findFirst.id,
            undefined,
            {
              name: updatedFindFirst.name,
            },
          ),
        ).rejects.toThrow(UnauthorizedException);
      });
    });
  });

  describe('delete', () => {
    describe('positive coverage:', () => {
      it("should delete it's own member & session if no id provided", async () => {
        prisma.session.findFirst = jest.fn().mockReturnValueOnce({
          ...findFirstSession,
          member: { ...findFirstWithOrg },
        });
        prisma.session.deleteMany = jest.fn();
        prisma.member.deleteMany = jest.fn().mockReturnValueOnce({ count: 1 });

        expect(
          await memberController.del(
            getSessionMock(baseMockSessionData),
            { ...findFirstWithOrg },
            undefined,
          ),
        ).toMatchObject(formatter.formatSuccess(true));
      });

      it("should delete it's another member & session if an id provided", async () => {
        prisma.session.findFirst = jest.fn().mockReturnValueOnce({
          ...findFirstSession,
          member: findFirst,
        });
        prisma.session.deleteMany = jest.fn();
        prisma.member.deleteMany = jest.fn().mockReturnValueOnce({ count: 1 });

        expect(
          await memberController.del(
            getSessionMock(baseMockSessionData),
            { ...findFirstWithOrg },
            findFirst.id,
            undefined,
          ),
        ).toMatchObject(formatter.formatSuccess(true));
      });
    });

    describe('negative coverage:', () => {
      it('should throw unauthorized if user is deleting another user', async () => {
        prisma.session.findFirst = jest.fn().mockReturnValueOnce({
          ...findFirstSession,
          member: findFirst,
        });
        prisma.session.deleteMany = jest.fn();
        prisma.member.deleteMany = jest.fn().mockReturnValueOnce({ count: 1 });

        expect(
          memberController.del(
            getSessionMock(baseMockSessionData),
            { ...findFirstWithOrg },
            'bad actor deleting another members id',
            undefined,
          ),
        ).rejects.toThrow(UnauthorizedException);
      });

      it('should throw not found if user is deleting does not exist', async () => {
        prisma.session.findFirst = jest.fn().mockReturnValueOnce({
          ...findFirstSession,
          member: findFirst,
        });
        prisma.session.deleteMany = jest.fn();
        prisma.member.deleteMany = jest.fn().mockReturnValueOnce({ count: 0 });

        expect(
          memberController.del(
            getSessionMock(baseMockSessionData),
            { ...findFirstWithOrg },
            undefined,
            undefined,
          ),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });
});
