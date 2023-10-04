import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ActivationEnd,
  Event,
  GuardsCheckEnd,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { firstValueFrom, Subject, take, toArray } from 'rxjs';

import * as act from './state/ngrx-router.actions';
import { NgrxRouterConnector } from './ngrx-router.connector';
import { defaultNgrxRouterStateOptions, ROUTER_STATE_OPTIONS } from './ngrx-router.configs';

describe('NgrxRouterConnector', () => {
  const events = new Subject<Event>();
  const root = new ActivatedRoute();

  let store: MockStore;
  let url = '/';

  const createService = createServiceFactory({
    service: NgrxRouterConnector,
    providers: [
      provideMockStore(),
      {
        provide: Router,
        useClass: class {
          get events() {
            return events;
          }
          get url() {
            return url;
          }

          get routerState() {
            return {
              root
            };
          }
        }
      },
      {
        provide: ROUTER_STATE_OPTIONS,
        useValue: defaultNgrxRouterStateOptions
      }
    ]
  });

  beforeEach(() => {
    const spectator = createService();
    store = spectator.inject(MockStore);
  });

  it('tracks guard end', async () => {
    url = '/';
    const snapshot: RouterStateSnapshot = { url, root: new ActivatedRouteSnapshot() };

    events.next(new GuardsCheckEnd(1, '/test', '/test', snapshot, true));

    const action = (await firstValueFrom(store.scannedActions$)) as act.RouteChangeAction;
    expect(action.url).toBe('/test');
  });

  it('tracks route leave', async () => {
    url = '/books/5';
    Object.defineProperty(root, 'routeConfig', { get: () => ({ path: 'books/:id' }) });
    Object.defineProperty(root, 'children', { value: [] });
    const snapshot: RouterStateSnapshot = { url, root: new ActivatedRouteSnapshot() };
    const actionsAsync = firstValueFrom(store.scannedActions$.pipe(take(3), toArray()));

    events.next(new GuardsCheckEnd(1, '/books/5', '/movies', snapshot, true));

    const actions = await actionsAsync;
    const action = actions.find((it) => it.type == act.routeLeave.type) as act.RouteLeaveAction;
    expect(action.url).toBe('/books/5');
    expect(action.route).toBe('/books/:id');
  });

  it('tracks first route ended', async () => {
    NgrxRouterConnector.firstActivationInProgress = true;
    events.next(new ActivationEnd(new ActivatedRouteSnapshot()));

    const action = (await firstValueFrom(store.scannedActions$)) as act.FirstRouteCompletedAction;
    expect(action.type).toBe('[Router] First Route Completed');
  });
});
