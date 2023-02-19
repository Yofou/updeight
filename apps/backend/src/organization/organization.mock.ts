import { randomUUID } from 'crypto';
import { Organization } from 'prisma';

export const findFirst: Organization = {
  id: randomUUID(),
  invite_code: '00000',
  name: 'visual boston',
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now()),
};

export const findMany = [findFirst];
