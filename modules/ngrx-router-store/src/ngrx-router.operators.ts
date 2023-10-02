import { Action } from '@ngrx/store';

import { OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

import * as actions from './state/ngrx-router.actions';

type RouteChange = ReturnType<typeof actions.routeChange>;
export function ofRoute(
  route: string | string[],
  except?: string | string[]
): OperatorFunction<Action, RouteChange> {
  return filter<Action, RouteChange>((action: Action): action is RouteChange => {
    if (action.type === actions.routeChange.type) {
      const routeAction = action as RouteChange;
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

type RouteLeave = ReturnType<typeof actions.routeLeave>;
export function onLeaveRoute(routes: string[]): OperatorFunction<Action, RouteLeave> {
  return filter<Action, RouteLeave>((action: Action): action is RouteLeave => {
    if (action.type === actions.routeLeave.type) {
      const routeAction = action as RouteLeave;
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
