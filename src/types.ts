import type * as express from 'express';
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
  NEST,
  NEXT,
  CUSTOM,
}

export interface NestNextRouterModuleOptions {
  viewsDir?: null | string;

  routeRequest: (request: express.Request, response: express.Response) => Promise<RequestRouteHandleType>;
}

export const NEST_NEXT_ROUTE_OPTIONS = Symbol('NEST_NEXT_ROUTE_OPTIONS');
