import { DynamicModule, Inject, Module } from '@nestjs/common';

import { HttpAdapterHost } from '@nestjs/core';
import type * as express from 'express';
import { FastifyReply } from 'fastify';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import path from 'path';
import { ParsedUrlQuery } from 'querystring';
import { NestNextRouterModule } from '../nest-next-router.module';
import { NextService } from '../next.service';
import { HttpServerType, NEST_NEXT_ROUTE_OPTIONS, NestNextRouterModuleOptions } from '../types';

export const NEST_NEXT_RENDER_OPTIONS = Symbol('NEST_NEXT_RENDER_OPTIONS');
interface NextRenderModuleOptions {
  viewsDir?: string;
}

@Module({})
export class NextRenderModule {
  constructor(
    @Inject(NEST_NEXT_ROUTE_OPTIONS) private readonly routeOptions: NestNextRouterModuleOptions,
    @Inject(NEST_NEXT_RENDER_OPTIONS) private readonly renderOptions: NextRenderModuleOptions,

    private readonly nestHost: HttpAdapterHost,
    private readonly nextService: NextService
  ) {
    if (this.routeOptions.serverType === HttpServerType.FASTIFY) {
      this.nestHost.httpAdapter.render = (response: FastifyReply, view: string, data: any) => {
        response.sent = true;
        return this.nextService.next.render(
          response.request.raw,
          response.raw,
          this.getView(view, response.request.query as ParsedUrlQuery),
          data
        );
      };
    } else {
      this.nestHost.httpAdapter.render = (response: express.Response, view: string, data: any) => {
        return this.nextService.next.render(response.req, response, this.getView(view, response.req.params), data);
      };

      this.nestHost.httpAdapter
        .getInstance()
        .use((request: express.Request, response: express.Response, next: () => any) => {
          response.render = (view: string, data?: object) => {
            return this.nextService.next.render(
              request,
              response,
              this.getView(view, request.params),
              data as NextParsedUrlQuery
            );
          };
          next();
        });
    }
  }

  private getView(view: string, params: ParsedUrlQuery): string {
    view = path.posix.join(this.renderOptions.viewsDir ?? '', view);
    view = view.replace(/\[([^\]]+)\]/g, (_: string, key: string) => {
      if (key in params) {
        return params[key] as string;
      }
      throw new Error(`Missing parameter: ${key}`);
    });
    return view;
  }

  public static forRoot(options?: NextRenderModuleOptions): DynamicModule {
    options ??= {};
    return {
      imports: [NestNextRouterModule],
      module: NextRenderModule,
      providers: [
        {
          provide: NEST_NEXT_RENDER_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
