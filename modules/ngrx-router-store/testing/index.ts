import { NgrxRouterPartialState, NgrxRouterState } from '../src';
import { initialState, NGRX_ROUTER_FEATURE_KEY } from '../src/state/ngrx-router.reducer';

export const createNgrxRouterPartialState = (
  state: Partial<NgrxRouterState>
): NgrxRouterPartialState => ({
  [NGRX_ROUTER_FEATURE_KEY]: {
    ...initialState,
    ...state
  }
});
