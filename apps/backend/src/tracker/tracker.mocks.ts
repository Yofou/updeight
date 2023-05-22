import { randomUUID } from 'crypto';
import { DateTime } from 'luxon';
import { Tracker } from 'prisma';

export const findFirst: Tracker = {
  id: randomUUID(),
  clientId: randomUUID(),
  memberId: randomUUID(),
  isToggledOn: true,
  lastToggledOn: DateTime.utc(2023, 6, 12).toJSDate(),
  createdFor: DateTime.utc(2023, 6, 12).toJSDate(),
  createdAt: DateTime.utc(2023, 6, 12).toJSDate(),
  updatedAt: DateTime.utc(2023, 6, 12).toJSDate(),
  beforeDuration: 0,
};

export const trackerPostBodyMock = {
  createdFor: DateTime.fromISO('2023-06-12').toJSDate(),
  clientId: findFirst.clientId,
};

export const trackerPutBodyMock = {
  createdFor: DateTime.fromISO('2023-06-12').toJSDate(),
  clientId: findFirst.clientId,
};
