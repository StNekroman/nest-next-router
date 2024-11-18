import { Injectable } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseNestNextRouteMiddleware } from './base-nest-next-router.middleware';
import { RequestRouteHandleType } from './types';

@Injectable()
export class FastifyNestNextRouteMiddleware extends BaseNestNextRouteMiddleware<FastifyRequest, FastifyReply> {
  protected override routeRequest(request: FastifyRequest, response: FastifyReply): Promise<RequestRouteHandleType> {
    return (
      this.options.routeRequest as (request: FastifyRequest, response: FastifyReply) => Promise<RequestRouteHandleType>
    )(request, response);
  }

  protected override forwardRequestToNext(request: FastifyRequest, response: FastifyReply): void {
    request.raw.url = request.originalUrl;
    this.nextService.next.getRequestHandler()(request.raw, response.raw);
  }
}
