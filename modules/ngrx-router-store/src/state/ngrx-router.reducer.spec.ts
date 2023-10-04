import * as act from './ngrx-router.actions';
import {
  createNgrxRouterPartialState,
  initialState,
  ngrxRouterReducer
} from './ngrx-router.reducer';

describe('router reducer', () => {
  describe('route change', () => {
    it('store params', () => {
      const action = act.routeChange({
        url: '/topic/1/posts',
        routes: ['/topic/:id/posts', '/topic/:id'],
        params: { id: '1' },
        queryParams: { subject: 'math' }
      });

      const state = ngrxRouterReducer(initialState, action);

      expect(state.url).toBe('/topic/1/posts');
      expect(state.routes).toEqual(['/topic/:id/posts', '/topic/:id']);
      expect(state.params.id).toBe('1');
      expect(state.queryParams.subject).toBe('math');
    });
  });

  describe('createNgrxRouterPartialState', () => {
    it('should create', () => {
      const appState = createNgrxRouterPartialState({
        url: '/test'
      });

      const state = appState['ngrx-router'];
      expect(state.url).toBe('/test');
      expect(state.routes).toHaveLength(0);
    });
  });
});
