import { describe, expect, test } from '@jest/globals';
import { ParsedUrlQuery } from 'querystring';
import { BaseNextRenderService } from '../src/render/base-next-render.service';

describe('BaseNextRenderService', () => {
  class BaseNextRenderServiceImpl extends BaseNextRenderService {
    public getViewPublic(view: string, params: ParsedUrlQuery) {
      return this.getView(view, params);
    }
  }

  test('getView', () => {
    let target = new BaseNextRenderServiceImpl({});
    expect(target.getViewPublic('page', {})).toEqual('page');
    expect(target.getViewPublic('/page', {})).toEqual('/page');

    target = new BaseNextRenderServiceImpl({
      viewsDir: '/',
    });
    expect(target.getViewPublic('page', {})).toEqual('/page');
    expect(target.getViewPublic('/page', {})).toEqual('/page');

    target = new BaseNextRenderServiceImpl({
      viewsDir: '',
    });
    expect(target.getViewPublic('page', {})).toEqual('page');
    expect(target.getViewPublic('/page', {})).toEqual('/page');

    target = new BaseNextRenderServiceImpl({
      viewsDir: '/subdir',
    });
    expect(target.getViewPublic('page', {})).toEqual('/subdir/page');
    expect(target.getViewPublic('/page', {})).toEqual('/subdir/page');

    target = new BaseNextRenderServiceImpl({
      viewsDir: 'subdir',
    });
    expect(target.getViewPublic('page', {})).toEqual('subdir/page');
    expect(target.getViewPublic('/page', {})).toEqual('subdir/page');
  });
});
