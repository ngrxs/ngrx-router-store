import { ENVIRONMENT_INITIALIZER, inject, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { NgrxRouterEffects } from './state/ngrx-router.effects';
import { NGRX_ROUTER_FEATURE_KEY, ngrxRouterReducer } from './state/ngrx-router.reducer';
import { NgrxRouterConnector } from './ngrx-router.connector';

export const provideNgrxRouterState = () => {
  return makeEnvironmentProviders([
    NgrxRouterConnector,
    provideState(NGRX_ROUTER_FEATURE_KEY, ngrxRouterReducer),
    provideEffects([NgrxRouterEffects]),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory: () => () => inject(NgrxRouterConnector)
    }
  ]);
};
