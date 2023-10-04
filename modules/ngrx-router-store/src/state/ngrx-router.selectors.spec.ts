import { NGRX_ROUTER_FEATURE_KEY, NgrxRouterPartialState } from './ngrx-router.reducer';
import {
  selectCurrentUrl,
  selectRouterActiveRoutes,
  selectRouterParams
} from './ngrx-router.selectors';

const createMockState = (): NgrxRouterPartialState => ({
  [NGRX_ROUTER_FEATURE_KEY]: {
    url: '/test/url/path',
    routes: ['/test/route', '/a/b/c/d/e'],
    params: { id: '5', age: 20 },
    queryParams: {}
  }
});

describe('router selectors', () => {
  describe('selectCurrentUrl', () => {
    it('gets the url', () => {
      const state = createMockState();
      const url = selectCurrentUrl(state);

      expect(url).toBe('/test/url/path');
    });
  });

  describe('selectRouterActiveRoutes', () => {
    it('gets the data', () => {
      const state = createMockState();
      const routes = selectRouterActiveRoutes(state);

      expect(routes).toEqual(['/test/route', '/a/b/c/d/e']);
    });
  });

  describe('selectRouterParams', () => {
    it('gets the data', () => {
      const state = createMockState();
      const params = selectRouterParams(state);

      expect(params.id).toBe('5');
      expect(params.age).toBe(20);
    });
  });
});
