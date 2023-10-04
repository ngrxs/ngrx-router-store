import { ActivatedRoute, ActivatedRouteSnapshot, Params } from '@angular/router';

import { NgrxRouterSnapshotState } from '../state/ngrx-router.reducer';

export function getRoutePath(route: ActivatedRouteSnapshot): string {
  const path =
    !route.routeConfig || !route.routeConfig.path || route.routeConfig.path.length === 0
      ? ''
      : '/' + route.routeConfig.path;
  return (route.parent === null ? '' : getRoutePath(route.parent)) + path;
}

export function getRouteParams(route: ActivatedRouteSnapshot, params: Params): Params {
  return typeof route === 'undefined' || route === null || route.children === null
    ? params
    : getRouteParams(route.children[0], Object.assign(params, route.params));
}

export function getRoutePathFromRoot(route: ActivatedRoute): string {
  const noChildren = route.children === null || route.children.length === 0;
  const path =
    !route.routeConfig || !route.routeConfig.path || route.routeConfig.path.length === 0
      ? ''
      : '/' + route.routeConfig.path;
  return noChildren ? path : path + getRoutePathFromRoot(route.children[0]);
}

export type NgrxRouteSnapshotSerializeFunc = (
  snapshot: ActivatedRouteSnapshot
) => NgrxRouterSnapshotState;

export const defaultRouteSnapshotSerializeFunc: NgrxRouteSnapshotSerializeFunc = (
  snapshot: ActivatedRouteSnapshot
) => ({
  queryParams: snapshot.queryParams,
  params: getRouteParams(snapshot, {})
});
