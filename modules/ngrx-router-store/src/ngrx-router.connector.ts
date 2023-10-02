import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  ActivationEnd,
  ActivationStart,
  Event,
  GuardsCheckEnd,
  GuardsCheckStart,
  Params,
  Router
} from '@angular/router';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';

import { getRouteParams, getRoutePath, getRoutePathFromRoot } from './state/ngrx-router.functions';
import * as actions from './state/ngrx-router.actions';

@Injectable()
export class NgrxRouterConnector implements OnDestroy {
  static firstActivationInProgress = true;

  readonly #router = inject(Router);
  readonly #store = inject(Store);

  #routes: string[] = [];
  #params: Params = {};
  #subscription?: Subscription;

  constructor() {
    this.#attachToRouterEvents();
  }

  ngOnDestroy(): void {
    this.#subscription?.unsubscribe();
  }

  #attachToRouterEvents() {
    this.#subscription = this.#router.events.subscribe((event: Event) => {
      if (event instanceof GuardsCheckStart) {
        this.#routes = [];
        this.#params = getRouteParams(event.state.root, {});
      } else if (event instanceof ActivationStart) {
        const route = getRoutePath(event.snapshot);
        if (route !== '' && !this.#routes.includes(route)) {
          this.#routes.push(route);
        }
      } else if (event instanceof GuardsCheckEnd && event.shouldActivate) {
        const currentUrl = this.#router.url;
        const url = event.urlAfterRedirects;
        if (currentUrl !== url && currentUrl !== '/') {
          const root = this.#router.routerState.root;
          const currentRoute = getRoutePathFromRoot(root);
          this.#store.dispatch(actions.routeLeave({ url: currentUrl, route: currentRoute }));
        }

        this.#store.dispatch(
          actions.routeChange({ url, routes: this.#routes, params: this.#params })
        );
      } else if (event instanceof ActivationEnd) {
        if (NgrxRouterConnector.firstActivationInProgress) {
          NgrxRouterConnector.firstActivationInProgress = false;
          this.#store.dispatch(actions.firstRouteCompleted());
        }
      }
    });
  }
}
