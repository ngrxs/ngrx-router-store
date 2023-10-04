import { Params } from '@angular/router';
import { createReducer, on } from '@ngrx/store';

import * as actions from './ngrx-router.actions';

export const NGRX_ROUTER_FEATURE_KEY = 'ngrx-router';

export interface NgrxRouterSnapshotState {
  params: Params;
  queryParams: Params;
}

export interface NgrxRouterState extends NgrxRouterSnapshotState {
  url: string;
  routes: string[];
}

export interface NgrxRouterPartialState {
  readonly [NGRX_ROUTER_FEATURE_KEY]: NgrxRouterState;
}

export const initialState: NgrxRouterState = {
  url: '',
  routes: [],
  params: {},
  queryParams: {}
};

export const ngrxRouterReducer = createReducer(
  initialState,
  on(
    actions.routeChange,
    (_, { url, routes, params, queryParams }): NgrxRouterState => ({
      url,
      routes,
      params,
      queryParams
    })
  )
);

export const createNgrxRouterPartialState = (
  state: Partial<NgrxRouterState>
): NgrxRouterPartialState => ({
  [NGRX_ROUTER_FEATURE_KEY]: {
    ...initialState,
    ...state
  }
});
