# @ngrxs/router-store

`@ngrxs/router-store` library serializes Angular router snapshots for NgRx Router Store. It searches entire route tree and puts only useful attributes into NgRx store.

## Installation

![npm peer dependency @angular/router version](https://img.shields.io/npm/dependency-version/@ngrxs/router-store/peer/@angular/router?logo=angular)
![npm peer dependency @ngrx/store version](https://img.shields.io/npm/dependency-version/@ngrxs/router-store/peer/@ngrx/store)

1.  Make sure that you've installed and setup `@angular/router` and `@ngrx/store`.

2.  ```
    npm install --save @ngrxs/router-store
    ```

3.  Import `provideNgrxRouterState` in `app.config.ts`:

    ```typescript

    import { ApplicationConfig } from '@angular/core';
    import { provideNgrxRouterState } from '@ngrxs/router-store';

    export const appConfig: ApplicationConfig = {
      providers: [
        provideNgrxRouterState()
      ]
    };

    ```

4.  Done! You can see `ngrx-router` state in `Redux DevTools`.

### Advanced Use

## Usage

`@ngrxs/router-store` provides selectors which you can use to select route properties.

```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentUrl } from '@ngrxs/router-store';

@Component({
  template: 'url: {url$ | async}',
  styles: []
})
export class RouteComponent {
  #store = inject(Store);
  url$ = this.#store.select(selectCurrentUrl);
}
```

### List of Selectors

| Selectors                | Usage                                                               |
| ------------------------ | ------------------------------------------------------------------- |
| selectCurrentUrl         | Select current route url                                            |
| selectRouterActiveRoutes | Select current activated routes                                     |
| selectRouterParams       | Select route parameters                                             |

## Interfaces

`@ngrxs/router-store` exposes interfaces used by serialized state.

`NgrxRouterState`

```typescript
{
  url: string;
  routes: string[];
  params: Params;
}
```

## Actions

You can also do navigation events with `@ngrxs/router-store`.

```typescript
import { goToUrl } from '@ngrxs/router-store';

this.store.dispatch(goToUrl({ url: '/books' }));
```

## RxJs operators

`@ngrxs/router-store` provides operators you can use to filter by routes

```typescript
import { ofRoute, onLeaveRoute } from '@ngrxs/router-store';

onPageEnter$ = createEffect(() =>
  this.#actions$.pipe(
    ofRoute(['/books']),
    map(() => loadBooks())
  )
);

onPageLeave$ = createEffect(() =>
  this.#actions$.pipe(
    onLeaveRoute(['/books']),
    map(() => clearBooks())
  )
);
```
