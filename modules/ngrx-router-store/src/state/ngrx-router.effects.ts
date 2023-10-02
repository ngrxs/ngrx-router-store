import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Location } from '@angular/common';

import { tap } from 'rxjs/operators';

import * as actions from './ngrx-router.actions';

@Injectable()
export class NgrxRouterEffects {
  readonly #actions$ = inject(Actions);
  readonly #router = inject(Router);
  readonly #location = inject(Location);

  navigateToUrl$ = createEffect(
    () => {
      return this.#actions$.pipe(
        ofType(actions.goToUrl),
        tap((action) => {
          void this.#router
            .navigateByUrl(action.url, {
              skipLocationChange: action.skipLocationChange ?? false
            })
            .then((ev) => {
              if (
                ev &&
                action.skipLocationChange &&
                typeof action.locationStateAfterNavigate !== 'undefined'
              ) {
                this.#location.replaceState(action.locationStateAfterNavigate);
              }
            });
        })
      );
    },
    { dispatch: false }
  );
}
