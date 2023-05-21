import { Prisma } from 'prisma';

const memberWithOrg = Prisma.validator<Prisma.MemberArgs>()({
  select: {
    id: true,
    name: true,
    email: true,
    createdAt: true,
    updatedAt: true,
    organizations: true,
  },
});

export type MemberWithOrg = Prisma.MemberGetPayload<typeof memberWithOrg>;
