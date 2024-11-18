import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextService } from './next.service';
import { NEST_NEXT_ROUTE_OPTIONS, NestNextRouterModuleOptions, RequestRouteHandleType } from './types';

@Injectable()
export abstract class BaseNestNextRouteMiddleware<REQUEST, RESPONSE> implements NestMiddleware<REQUEST, RESPONSE> {
  constructor(
    @Inject(NEST_NEXT_ROUTE_OPTIONS) protected readonly options: NestNextRouterModuleOptions,
    protected readonly nextService: NextService
  ) {}

  protected abstract routeRequest(request: REQUEST, response: RESPONSE): Promise<RequestRouteHandleType>;

  protected abstract forwardRequestToNext(request: REQUEST, response: RESPONSE): void;

  public async use(request: REQUEST, response: RESPONSE, nest: (error?: Error | any) => void) {
    const handleType = await this.routeRequest(request, response);
    switch (handleType) {
      case RequestRouteHandleType.NEST:
        nest();
        break;
      case RequestRouteHandleType.NEXT:
        this.forwardRequestToNext(request, response);
        break;
      case RequestRouteHandleType.CUSTOM:
      default:
      // do nothing - should be already handled by custom handler from outside
    }
  }
}
