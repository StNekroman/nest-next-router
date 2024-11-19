[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine/)

# Nest-Nest Router

Inspided by https://github.com/kyle-mccarthy/nest-next, but done right.  
Bridge between Nest backend and Next back&frontend - **on the same host**.  
Allows to use all Next features (like SSR) while keeping running Nest backend.  
Main host is Nest (over express/Fastify), which runs inside Next custom server.

Main idea of routing request between two systems - top-level request switcher/router.

## Installation

npm

```shell
npm i @stnekroman/nest-next-router
```

yarn

```shell
yarn add @stnekroman/nest-next-router
```

# Basic usage with express.js

```TypeScript
import {
  NestNextRouterModule,
  RequestRouteHandleType,
} from '@stnekroman/nest-next-router';

@Module({
  imports: [
    NestNextRouterModule.forRootAsync(
      Next({
        // your own Next config here
      }),
      {
        routeRequest: async (request: express.Request, response: express.Response): Promise<RequestRouteHandleType> => {
          if (request.baseUrl.startsWith('/api') || request.baseUrl.startsWith('/v1/api')) {
            return RequestRouteHandleType.NEST; // forward all /api requests to Nest backend
          } else {
            return RequestRouteHandleType.NEXT; // all other requests will go to Next
          }
        }
      }
    )
  ]
})
export class RootModule {}
```

# Basic usage with Fastify

```TypeScript
import {
  NestNextRouterModule,
  RequestRouteHandleType,
} from '@stnekroman/nest-next-router';

@Module({
  imports: [
    NestNextRouterModule.forRootAsync(
      Next({
        // your own Next config here
      }),
      {
        serverType: HttpServerType.FASTIFY,
        routeRequest: async (request: FastifyRequest, response: FastifyReply): Promise<RequestRouteHandleType> => {
          if (request.baseUrl.startsWith('/api') || request.baseUrl.startsWith('/v1/api')) {
            return RequestRouteHandleType.NEST; // forward all /api requests to Nest backend
          } else {
            return RequestRouteHandleType.NEXT; // all other requests will go to Next
          }
        }
      }
    )
  ]
})
export class RootModule {}
```

# Why?

Why not "nest-next", after all?  
Because this solutions just routes incomming requests. So it's pretty easy and clear - you just define, which requests and where are served.  
Depending on URL, header params, weather out of the window - it's up to you.  
Thus this makes usage of top-level routing very versatile.

And! Nest-next provides Next render engine to Nest, and allows only that.  
So routing of pages is done on Nest side. Thus, if someday you will decide to split Nest/Next to separate microservices (in order to scale horizontally) - you will need to fallback to Next routing anaway. So more refactoring.  
While Next file-based routing is more versatile (especially for SEO) than Nest, so whay wire yourself to Nest view/render routing?

And! Even more, Nest-next provides render engine, but only oine bridge between Nest->Next remains - it's ability to route 404 errors from Nest to Next, nothing more.  
That means, that you loose ability (in out-of-the box configuration) to serve on Next things like: favicon.ico, Next metadata (robots.txt), static files (CSS bundles, images from Next directories)  
Technically, you can write your custom route rules to EACH route (favicon.ico) in order to forward to Next (actually - render content via Next). But hopefully you understand how that is uncool.

# I want Next render engine in Nest. Now!

First of all, you don't need that - just use Next file-based routing and that's all.  
But in case if you **really** need Next render engine on Nest side and insist, you can do it (while not recommended):

```TypeScript
import {
  NestNextRouterModule,
  NextRenderModule,
  RequestRouteHandleType,
} from '@stnekroman/nest-next-router';

@Module({
  imports: [
    NestNextRouterModule.forRootAsync(
      Next({
        // config
      }),
      {
        routeRequest: async (request: express.Request, response: express.Response): Promise<RequestRouteHandleType> => {
          if (request.baseUrl.startsWith('/api') || request.baseUrl.startsWith('/v1/api')) {
            return RequestRouteHandleType.NEST; // forward all /api requests to Nest backend
          } else {
            return RequestRouteHandleType.NEXT; // all other requests will go to Next
          }
        }
      }
    ),
    NextRenderModule.forRoot() // just add this
  ]
})
export class RootModule {}
```

# Ability to pass 404 http error down to Next

User case: to render nice-looking not_found Next page instead of standard Nest json response.  
As nest-next had ability to pass 404 errors down to Next (while incorrectly), here you can do the same.  
Just apply global filter:

```TypeScript
@Module({
  imports: [
    // ...
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: Http404ExceptionFilter,
    },
  ]
})
export class RootModule {}
```

That's it. You can apply that filter globalle, per controller or per route basis.  
Looking on how filter is done you can craft your own and apply where you need.

# API

## NestNextRouterModuleOptions

Options, passed to `NestNextRouterModule.forRootAsync(...)` method.

| Param          | Description                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------- |
| `serverType`   | Type of underlaying HTTP server, if not specified - express by default                          |
| `routeRequest` | method to handle incomming requests to say to which direction to route them.                    |
|                | Possible return values:                                                                         |
|                | \* `NEST` - forward request to Nest                                                             |
|                | \*`NEXT` - forward request to Next                                                              |
|                | \*`CUSTOM` - you way have already handled the request differently - nothing to do from our side |

## NextRenderModuleOptions

Options passed to `NextRenderModule`

| Param      | Description                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `viewsDir` | Prefix, which to prepend to view, which required to resolve.                                                                                           |
|            | For example, you may use `@Render('that')`, but in reality your page `that` sits on path `subdir/that`on Next side. So `viewsDir: subdir/` should help |

---

License MIT, good luck
