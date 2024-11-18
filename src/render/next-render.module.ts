import { DynamicModule, Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
/*
import { HttpAdapterHost } from '@nestjs/core';
import type * as express from 'express';
import { FastifyReply } from 'fastify';
import { NextService } from '../next.service';
import { HttpServerType, NEST_NEXT_ROUTE_OPTIONS, NestNextRouterModuleOptions } from '../types';*/

@Module({})
//implements NestModule
export class NextRenderModule {
  /*constructor(
    @Inject(NEST_NEXT_ROUTE_OPTIONS) private readonly options: NestNextRouterModuleOptions,
    private readonly nestHost: HttpAdapterHost,
    private readonly nextService: NextService
  ) {
    if (options.serverType === HttpServerType.FASTIFY) {
      this.nestHost.httpAdapter.render = (response: FastifyReply, view: string, data: any) => {
        response.sent = true;
        return this.nextService.next.render(response.request.raw, response.raw, view, data);
      };
    } else {
      this.nestHost.httpAdapter.render = (response: express.Response, view: string, data: any) => {
        return this.nextService.next.render(response.req, response, view, data);
      };
    }
  }

  public static forRoot(): DynamicModule {
    return {
      imports: [],
      module: NextRenderModule,
    };
  }*/
  //  public configure(consumer: MiddlewareConsumer) {}
}
