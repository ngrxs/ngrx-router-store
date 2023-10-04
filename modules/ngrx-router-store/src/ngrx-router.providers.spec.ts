import { inject, Injectable } from '@angular/core';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { provideStore } from '@ngrx/store';

import { provideNgrxRouterState } from './ngrx-router.providers';
import { NgrxRouterStateOptions, ROUTER_STATE_OPTIONS } from './ngrx-router.configs';
import { NgrxRouteSnapshotSerializeFunc } from './serializers/ngrx-router.functions';

@Injectable()
class TestService {
  readonly options = inject<NgrxRouterStateOptions>(ROUTER_STATE_OPTIONS);
}

describe('providers', () => {
  const func: NgrxRouteSnapshotSerializeFunc = () => ({ params: {}, queryParams: {} });
  const createService = createServiceFactory({
    service: TestService,
    providers: [
      provideStore(),
      provideNgrxRouterState({
        serializerFunc: func
      })
    ]
  });

  it('has default options', () => {
    const spectator = createService();
    expect(spectator.service.options.serializerFunc).toBe(func);
  });
});
