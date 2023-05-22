import { Session, SessionData } from '@fastify/secure-session';
import { randomUUID } from 'crypto';
import { Session as PrismaSession } from 'prisma';
import { findFirst as findFirstMember } from '../member/member.mock';

type Key = Parameters<Session['get']>[0];
type MockedSessionResponse = {
  changed: boolean;
  deleted: boolean;
  get: {
    [key: Key]: any;
  };
};

type GetSessionMock = (arg0?: Partial<MockedSessionResponse>) => Session;
export const getSessionMock: GetSessionMock = (mock = {}) => {
  return {
    changed: mock.changed,
    deleted: mock.deleted,
    get(value: Key) {
      return mock.get[value];
    },
    set(key: Key, value: any) {
      mock.get[key] = value;
      return undefined as void;
    },
    data() {
      return mock.get as SessionData;
    },
    delete() {
      return undefined as void;
    },
    options() {
      return undefined as void;
    },
  };
};

export const findFirst: PrismaSession = {
  id: randomUUID(),
  memberId: findFirstMember.id,
  expiresAt: new Date(Date.now()),
};
