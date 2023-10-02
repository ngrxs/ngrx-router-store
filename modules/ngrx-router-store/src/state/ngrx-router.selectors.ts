import { createFeatureSelector, createSelector } from '@ngrx/store';

import { NGRX_ROUTER_FEATURE_KEY, NgrxRouterState } from './ngrx-router.reducer';

const selectNgrxRouterState = createFeatureSelector<NgrxRouterState>(NGRX_ROUTER_FEATURE_KEY);
const selectCurrentUrl = createSelector(selectNgrxRouterState, (state) => state.url);
const selectRouterActiveRoutes = createSelector(selectNgrxRouterState, (state) => state.routes);
const selectRouterParams = createSelector(selectNgrxRouterState, (state) => state.params);

export { selectCurrentUrl, selectRouterActiveRoutes, selectRouterParams };
