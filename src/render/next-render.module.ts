import { DynamicModule, Module } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { NestNextRouterModule } from '../nest-next-router.module';
import { NextService } from '../next.service';
import { HttpServerType, NEST_NEXT_ROUTE_OPTIONS, NestNextRouterModuleOptions } from '../types';
import { BaseNextRenderService, NextRenderModuleOptions } from './base-next-render.service';
import { ExpressNextRenderService } from './express-next-render.service';
import { FastifyNextRenderService } from './fastify-next-render.service';

@Module({})
export class NextRenderModule {
  public static forRoot(options?: NextRenderModuleOptions): DynamicModule {
    options ??= {};
    return {
      imports: [NestNextRouterModule],
      module: NextRenderModule,
      providers: [
        {
          inject: [NEST_NEXT_ROUTE_OPTIONS, HttpAdapterHost, NextService],
          provide: BaseNextRenderService,
          useFactory: (
            routeOptions: NestNextRouterModuleOptions,
            nestHost: HttpAdapterHost,
            nextService: NextService
          ): BaseNextRenderService => {
            if (routeOptions.serverType === HttpServerType.FASTIFY) {
              return new FastifyNextRenderService(options, nestHost, nextService);
            } else {
              return new ExpressNextRenderService(options, nestHost, nextService);
            }
          },
        },
      ],
    };
  }
}
