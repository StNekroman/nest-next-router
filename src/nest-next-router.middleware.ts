import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import type * as express from 'express';
import { NextService } from './next.service';
import { NEST_NEXT_ROUTE_OPTIONS, NestNextRouterModuleOptions, RequestRouteHandleType } from './types';

@Injectable()
export class NestNextRouteMiddleware implements NestMiddleware<express.Request, express.Response> {
  constructor(
    @Inject(NEST_NEXT_ROUTE_OPTIONS) private readonly options: NestNextRouterModuleOptions,
    @Inject(NextService) private readonly nextService: NextService
  ) {}

  public async use(request: express.Request, response: express.Response, nest: (error?: Error | any) => void) {
    const handleType = await this.options.routeRequest(request, response);
    switch (handleType) {
      case RequestRouteHandleType.NEST:
        nest();
        break;
      case RequestRouteHandleType.NEXT:
        request.url = request.originalUrl;
        this.nextService.next.getRequestHandler()(request, response);
        break;
      case RequestRouteHandleType.CUSTOM:
      default:
      // do nothing - should be already handled by custom handler from outside
    }
  }
}
