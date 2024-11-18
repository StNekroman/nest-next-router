import { Injectable } from '@nestjs/common';
import type * as express from 'express';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { BaseNestNextRouteMiddleware } from './base-nest-next-router.middleware';
import { RequestRouteHandleType } from './types';

@Injectable()
export class ExpressNestNextRouteMiddleware extends BaseNestNextRouteMiddleware<express.Request, express.Response> {
  protected override routeRequest(
    request: express.Request,
    response: express.Response
  ): Promise<RequestRouteHandleType> {
    return (
      this.options.routeRequest as (
        request: express.Request,
        response: express.Response
      ) => Promise<RequestRouteHandleType>
    )(request, response);
  }

  protected override forwardRequestToNext(request: express.Request, response: express.Response): void {
    request.url = request.originalUrl;
    this.nextService.next.getRequestHandler()(request, response);
  }

  private forwardFastifyRequestToNext(request: FastifyRequest, response: FastifyReply) {
    request.raw.url = request.originalUrl;
    this.nextService.next.getRequestHandler()(request.raw, response.raw);
  }
}
