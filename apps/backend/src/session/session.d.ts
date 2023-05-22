import fastify from 'fastify';

declare module 'fastify' {
  export interface FastifyRequest {
    member: import('./session.types').MemberWithOrg;
  }
}
