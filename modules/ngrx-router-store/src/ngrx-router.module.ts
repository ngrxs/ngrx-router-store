import { ENVIRONMENT_INITIALIZER, inject, ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { NgrxRouterEffects } from './state/ngrx-router.effects';
import { NGRX_ROUTER_FEATURE_KEY, ngrxRouterReducer } from './state/ngrx-router.reducer';
import { NgrxRouterConnector } from './ngrx-router.connector';
import {
  defaultNgrxRouterStateOptions,
  NgrxRouterStateOptions,
  ROUTER_STATE_OPTIONS
} from './ngrx-router.configs';

@NgModule({
  imports: [
    StoreModule.forFeature(NGRX_ROUTER_FEATURE_KEY, ngrxRouterReducer),
    EffectsModule.forFeature([NgrxRouterEffects])
  ]
})
export class NgrxRouterStateModule {
  forRoot(options: NgrxRouterStateOptions = {}): ModuleWithProviders<NgrxRouterStateModule> {
    const _options = { ...defaultNgrxRouterStateOptions, ...options };
    return {
      ngModule: NgrxRouterStateModule,
      providers: [
        { provide: ROUTER_STATE_OPTIONS, useValue: _options },
        NgrxRouterConnector,
        {
          provide: ENVIRONMENT_INITIALIZER,
          multi: true,
          useFactory: () => () => inject(NgrxRouterConnector)
        }
      ]
    };
  }
}
