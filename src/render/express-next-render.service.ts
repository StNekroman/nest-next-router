import { Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type * as express from 'express';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { NextService } from '../next.service';
import { BaseNextRenderService, NextRenderModuleOptions } from './base-next-render.service';

@Injectable()
export class ExpressNextRenderService extends BaseNextRenderService {
  constructor(
    renderOptions: NextRenderModuleOptions,
    private readonly nestHost: HttpAdapterHost,
    private readonly nextService: NextService
  ) {
    super(renderOptions);

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
