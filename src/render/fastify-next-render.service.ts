import { Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ParsedUrlQuery } from 'querystring';
import { NextService } from '../next.service';
import { BaseNextRenderService, NextRenderModuleOptions } from './base-next-render.service';

@Injectable()
export class FastifyNextRenderService extends BaseNextRenderService {
  constructor(
    renderOptions: NextRenderModuleOptions,
    private readonly nestHost: HttpAdapterHost,
    private readonly nextService: NextService
  ) {
    super(renderOptions);

    this.nestHost.httpAdapter.render = (response: FastifyReply, view: string, data: any) => {
      response.sent = true;
      return this.nextService.next.render(
        response.request.raw,
        response.raw,
        this.getView(view, response.request.query as ParsedUrlQuery),
        data
      );
    };

    const self = this;

    this.nestHost.httpAdapter.getInstance().decorateReply('render', function (view: string, data?: ParsedUrlQuery) {
      // @ts-ignore
      const response: FastifyReply = this.res;
      // @ts-ignore
      const request: FastifyRequest = this.request.raw;

      response.sent = true;

      return nextService.next.render(
        response.request.raw,
        response.raw,
        self.getView(view, response.request.query as ParsedUrlQuery),
        data
      );
    });
  }
}
