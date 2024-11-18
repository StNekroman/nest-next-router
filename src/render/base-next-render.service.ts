import { Injectable } from '@nestjs/common';
import path from 'path';
import { ParsedUrlQuery } from 'querystring';

export interface NextRenderModuleOptions {
  viewsDir?: string;
}

@Injectable()
export abstract class BaseNextRenderService {
  constructor(protected readonly renderOptions: NextRenderModuleOptions) {}

  protected getView(view: string, params: ParsedUrlQuery): string {
    view = path.posix.join(this.renderOptions.viewsDir ?? '', view);
    view = view.replace(/\[([^\]]+)\]/g, (_: string, key: string) => {
      if (key in params) {
        return params[key] as string;
      }
      throw new Error(`Missing parameter: ${key}`);
    });
    return view;
  }
}
