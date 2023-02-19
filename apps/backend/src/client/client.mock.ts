import { randomUUID } from 'crypto';
import { Client, Organization } from 'prisma';
import { findFirst as findFirstOrganization } from '../organization/organization.mock';

export const findFirst: Omit<Client, 'organizationId'> & {
  organization: Organization;
} = {
  id: randomUUID(),
  name: 'project updeight',
  thumbnail:
    'https://www.thetimes.co.uk/imageserver/image/%2Fmethode%2Fsundaytimes%2Fprod%2Fweb%2Fbin%2Fe6496bba-3356-11ec-91da-063c6e372e74.jpg?crop=2667%2C1500%2C0%2C0',
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now()),
  organization: findFirstOrganization,
};

export const findMany = [findFirst];
