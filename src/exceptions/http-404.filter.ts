import { ArgumentsHost, Catch, HttpStatus, NotFoundException, OnModuleInit } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import type * as express from 'express';
import { NextService } from '../next.service';

@Catch(NotFoundException)
export class Http404ExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly nextService: NextService) {
    super();
  }

  public override catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: express.Request = ctx.getRequest();
    const response: express.Response = ctx.getResponse();

    if (response && request && !response.headersSent) {
      return this.nextService.next.getRequestHandler()(request, response);
    } else {
      return super.catch(exception, host);
    }
  }
}
