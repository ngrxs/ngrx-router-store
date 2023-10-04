import { Params } from '@angular/router';
import { createAction, props } from '@ngrx/store';

export const goToUrl = createAction(
  '[Router] Go To Url',
  props<{
    url: string;
    skipLocationChange?: boolean;
    locationStateAfterNavigate?: string;
  }>()
);

export const routeChange = createAction(
  '[Router] Route Change',
  props<{ url: string; routes: string[]; params: Params; queryParams: Params }>()
);

export const routeLeave = createAction(
  '[Router] Route Leave',
  props<{ url: string; route: string }>()
);

export const firstRouteCompleted = createAction('[Router] First Route Completed');

export type GoToUrlAction = ReturnType<typeof goToUrl>;
export type RouteChangeAction = ReturnType<typeof routeChange>;
export type RouteLeaveAction = ReturnType<typeof routeLeave>;
export type FirstRouteCompletedAction = ReturnType<typeof firstRouteCompleted>;
