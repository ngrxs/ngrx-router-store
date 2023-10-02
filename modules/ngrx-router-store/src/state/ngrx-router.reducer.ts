import { createReducer, on } from '@ngrx/store';

import * as actions from './ngrx-router.actions';
import { Params } from '@angular/router';

export const NGRX_ROUTER_FEATURE_KEY = 'ngrx-router';

export interface NgrxRouterState {
  url: string;
  routes: string[];
  params: Params;
}

export interface NgrxRouterPartialState {
  readonly [NGRX_ROUTER_FEATURE_KEY]: NgrxRouterState;
}

export const initialState: NgrxRouterState = {
  url: '',
  routes: [],
  params: {}
};

export const ngrxRouterReducer = createReducer(
  initialState,
  on(
    actions.routeChange,
    (_, { url, routes, params }): NgrxRouterState => ({ url, routes, params })
  )
);
