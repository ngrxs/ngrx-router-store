/* eslint-disable @typescript-eslint/unbound-method */

import { createServiceFactory, SpyObject } from '@ngneat/spectator/jest';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';

import { firstValueFrom, Observable, of } from 'rxjs';

import { NgrxRouterEffects } from './ngrx-router.effects';
import * as act from './ngrx-router.actions';

describe('ngrx router', () => {
  let actions: Observable<Action>;
  let router: SpyObject<Router>;
  let effects: NgrxRouterEffects;
  const createService = createServiceFactory({
    service: NgrxRouterEffects,
    providers: [provideMockActions(() => actions)],
    mocks: [Router]
  });

  beforeEach(() => {
    const spectator = createService();
    effects = spectator.service;
    router = spectator.inject(Router);
  });

  describe('navigateToUrl', () => {
    it('should go to url', async () => {
      router.navigateByUrl.andReturn(Promise.resolve());

      actions = of(act.goToUrl({ url: '/test' }));

      await firstValueFrom(effects.navigateToUrl$);

      expect(router.navigateByUrl).toHaveBeenCalledWith('/test', { skipLocationChange: false });
    });
  });
});
