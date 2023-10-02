import {
  ActivatedRouteSnapshot,
  ActivationEnd,
  Event,
  GuardsCheckEnd,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { firstValueFrom, Subject } from 'rxjs';

import * as act from './state/ngrx-router.actions';
import { NgrxRouterConnector } from './ngrx-router.connector';

describe('NgrxRouterConnector', () => {
  const events = new Subject<Event>();
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
        }
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

    const action = (await firstValueFrom(store.scannedActions$)) as act.RouteChangeProps;
    expect(action.url).toBe('/test');
  });

  it('tracks first route ended', async () => {
    NgrxRouterConnector.firstActivationInProgress = true;
    events.next(new ActivationEnd(new ActivatedRouteSnapshot()));

    const action = (await firstValueFrom(store.scannedActions$)) as act.FirstRouteCompletedProps;
    expect(action.type).toBe('[Router] First Route Completed');
  });
});
