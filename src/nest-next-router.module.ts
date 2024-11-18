import { DynamicModule, Global, Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NextService } from './next.service';
import { ExpressNestNextRouteMiddleware } from './express-nest-next-router.middleware';
import { NextServer, NEST_NEXT_ROUTE_OPTIONS, NestNextRouterModuleOptions, HttpServerType } from './types';
import { FastifyNestNextRouteMiddleware } from './fastify-nest-next-router.middleware';
import { HttpAdapterHost } from '@nestjs/core';

@Global()
@Module({})
export class NestNextRouterModule implements NestModule {
  constructor(@Inject(NEST_NEXT_ROUTE_OPTIONS) private readonly options: NestNextRouterModuleOptions) {
    this.options.serverType ??= HttpServerType.EXPRESS;
  }

  public static async forRootAsync(next: NextServer, options: NestNextRouterModuleOptions): Promise<DynamicModule> {
    await next.prepare();

    return {
      module: NestNextRouterModule,
      providers: [
        {
          provide: NEST_NEXT_ROUTE_OPTIONS,
          useValue: options,
        },
        {
          provide: NextService,
          useFactory: (): NextService => {
            return new NextService(next);
          },
        },
      ],
      exports: [NextService, NEST_NEXT_ROUTE_OPTIONS],
    };
  }

  public configure(consumer: MiddlewareConsumer) {
    if (this.options.serverType === HttpServerType.FASTIFY) {
      consumer.apply(FastifyNestNextRouteMiddleware).forRoutes('*');
    } else {
      consumer.apply(ExpressNestNextRouteMiddleware).forRoutes('*');
    }
  }
}
