import type * as express from 'express';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';
import createServer from 'next';
import { NextParsedUrlQuery, NextUrlWithParsedQuery } from 'next/dist/server/request-meta';

export type NextServer = Pick<
  ReturnType<typeof createServer>,
  'options' | 'hostname' | 'port' | 'getRequestHandler' | 'getUpgradeHandler' | 'setAssetPrefix' | 'prepare' | 'close'
> & {
  render: (
    req: IncomingMessage,
    res: ServerResponse,
    pathname: string,
    query?: NextParsedUrlQuery,
    parsedUrl?: NextUrlWithParsedQuery,
    internal?: boolean
  ) => Promise<void>;
}; // hacky solution to expose NextServer, because somebody "smart" included private unique symbol to original NextServer declaration typing

export enum RequestRouteHandleType {
  NEST = 'NEST',
  NEXT = 'NEXT',
  CUSTOM = 'CUSTOM',
}

export enum HttpServerType {
  EXPRESS = 'EXPRESS',
  FASTIFY = 'FASTIFY',
}

export type NestNextRouterModuleOptions =
  | {
      serverType?: HttpServerType.EXPRESS;
      routeRequest: (request: express.Request, response: express.Response) => Promise<RequestRouteHandleType>;
    }
  | {
      serverType: HttpServerType.FASTIFY;
      routeRequest: (request: FastifyRequest, response: FastifyReply) => Promise<RequestRouteHandleType>;
    };

export const NEST_NEXT_ROUTE_OPTIONS = Symbol('NEST_NEXT_ROUTE_OPTIONS');
