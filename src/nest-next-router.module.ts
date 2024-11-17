import { DynamicModule, Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NextService } from './next.service';
import { NestNextRouteMiddleware } from './nest-next-router.middleware';
import { NextServer, NEST_NEXT_ROUTE_OPTIONS, NestNextRouterModuleOptions } from './types';

@Module({
  providers: [],
})
export class NestNextRouterModule implements NestModule {
  constructor(@Inject(NEST_NEXT_ROUTE_OPTIONS) private readonly options: NestNextRouterModuleOptions) {}

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
          useFactory: () => {
            return new NextService(next);
          },
        },
      ],
    };
  }

  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(NestNextRouteMiddleware).forRoutes('*');
  }
}
