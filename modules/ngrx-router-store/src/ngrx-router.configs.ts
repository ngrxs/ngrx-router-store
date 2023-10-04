import { InjectionToken } from '@angular/core';

import {
  defaultRouteSnapshotSerializeFunc,
  NgrxRouteSnapshotSerializeFunc
} from './serializers/ngrx-router.functions';

export interface NgrxRouterStateOptions {
  serializerFunc?: NgrxRouteSnapshotSerializeFunc;
}

export const defaultNgrxRouterStateOptions: NgrxRouterStateOptions = {
  serializerFunc: defaultRouteSnapshotSerializeFunc
};

export const ROUTER_STATE_OPTIONS = new InjectionToken<NgrxRouterStateOptions>('__ROUTER_OPTIONS');
