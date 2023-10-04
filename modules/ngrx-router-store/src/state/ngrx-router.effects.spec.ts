/* eslint-disable @typescript-eslint/unbound-method */

import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { createServiceFactory, SpyObject } from '@ngneat/spectator/jest';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';

import { firstValueFrom, Observable, of } from 'rxjs';

import { NgrxRouterEffects } from './ngrx-router.effects';
import * as act from './ngrx-router.actions';

describe('ngrx router', () => {
  let actions: Observable<Action>;
  let router: SpyObject<Router>;
  let location: SpyObject<Location>;
  let effects: NgrxRouterEffects;
  const createService = createServiceFactory({
    service: NgrxRouterEffects,
    providers: [provideMockActions(() => actions)],
    mocks: [Router, Location]
  });

  beforeEach(() => {
    const spectator = createService();
    effects = spectator.service;
    router = spectator.inject(Router);
    location = spectator.inject(Location);
  });

  describe('navigateToUrl', () => {
    it('should go to url', async () => {
      router.navigateByUrl.andReturn(Promise.resolve());

      actions = of(act.goToUrl({ url: '/test' }));

      await firstValueFrom(effects.navigateToUrl$);

      expect(router.navigateByUrl).toHaveBeenCalledWith('/test', { skipLocationChange: false });
    });

    it('should go to url and skip location', async () => {
      router.navigateByUrl.andReturn(Promise.resolve(true));

      actions = of(
        act.goToUrl({
          url: '/test',
          skipLocationChange: true,
          locationStateAfterNavigate: '/dashboard'
        })
      );

      await firstValueFrom(effects.navigateToUrl$);

      expect(router.navigateByUrl).toHaveBeenCalledWith('/test', { skipLocationChange: true });
      expect(location.replaceState).toHaveBeenCalledWith('/dashboard');
    });
  });
});
