import { Action } from '@ngrx/store';

import { OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

import {
  routeChange,
  RouteChangeAction,
  routeLeave,
  RouteLeaveAction
} from './state/ngrx-router.actions';

export function ofRoute(
  route: string | string[],
  except?: string | string[]
): OperatorFunction<Action, RouteChangeAction> {
  return filter<Action, RouteChangeAction>((action: Action): action is RouteChangeAction => {
    if (action.type === routeChange.type) {
      const routeAction = action as RouteChangeAction;
      if (
        typeof except !== 'undefined' &&
        except !== null &&
        except.length > 0 &&
        compareRoutes(except, routeAction.routes)
      ) {
        return false;
      }

      return compareRoutes(route, routeAction.routes);
    }

    return false;
  });
}

export function onLeaveRoute(routes: string[]): OperatorFunction<Action, RouteLeaveAction> {
  return filter<Action, RouteLeaveAction>((action: Action): action is RouteLeaveAction => {
    if (action.type === routeLeave.type) {
      const routeAction = action as RouteLeaveAction;
      return routes.includes(routeAction.route);
    }

    return false;
  });
}

function compareRoutes(route: string | string[], paths: string | string[]): boolean {
  if (Array.isArray(route) && Array.isArray(paths)) {
    return paths.findIndex((it) => route.includes(it)) > -1;
  } else if (!Array.isArray(route) && Array.isArray(paths)) {
    return paths.includes(route);
  } else if (Array.isArray(route) && !Array.isArray(paths)) {
    return route.includes(paths);
  }

  return route === paths;
}
