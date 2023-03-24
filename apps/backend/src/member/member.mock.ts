import { randomUUID } from 'crypto';
import { Member } from 'prisma';

export const findFirst: Omit<Member, 'password'> = {
  id: randomUUID(),
  name: 'johndoe2002',
  email: 'johndoe@email.com',
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now()),
};

export const findMany = [findFirst];
