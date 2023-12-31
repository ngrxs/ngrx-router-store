import { ActivatedRoute, ActivatedRouteSnapshot, Route } from '@angular/router';

import { getRoutePathFromRoot, getRoutePath, getRouteParams } from './ngrx-router.functions';
import { Params } from '@angular/router';

const createActivatedRoute = (route: Route, children: null | ActivatedRoute[]): ActivatedRoute => {
  const root = new ActivatedRoute();
  Object.defineProperty(root, 'routeConfig', { get: () => route });
  Object.defineProperty(root, 'children', { value: children });
  return root;
};

const createActivatedRouteSnapshot = (
  route: Route,
  parent: null | ActivatedRouteSnapshot,
  children: ActivatedRouteSnapshot[] = [],
  params: Params = {}
): ActivatedRouteSnapshot => {
  const snapshot = new ActivatedRouteSnapshot();
  Object.defineProperty(snapshot, 'routeConfig', { get: () => route });
  Object.defineProperty(snapshot, 'parent', { value: parent });
  Object.defineProperty(snapshot, 'children', { value: children });
  Object.defineProperty(snapshot, 'params', { get: () => params });
  return snapshot;
};

describe('functions', () => {
  it('getRoutePathFromRoot gets the top route path', () => {
    const root = createActivatedRoute({ path: 'topics/:id' }, null);

    const path = getRoutePathFromRoot(root);

    expect(path).toBe('/topics/:id');
  });

  it('getRoutePathFromRoot gets the route path with children', () => {
    const p2 = createActivatedRoute({ path: 'edit' }, null);
    const p1 = createActivatedRoute({ path: ':id' }, [p2]);
    const root = createActivatedRoute({ path: 'topics' }, [p1]);

    const path = getRoutePathFromRoot(root);

    expect(path).toBe('/topics/:id/edit');
  });

  it('getRoutePath gets the current path of root', () => {
    const snapshot = createActivatedRouteSnapshot({ path: 'test' }, null);

    const path = getRoutePath(snapshot);

    expect(path).toBe('/test');
  });

  it('getRoutePath gets the path by looking up', () => {
    const root = createActivatedRouteSnapshot({ path: 'topics' }, null);
    const p1 = createActivatedRouteSnapshot({ path: ':id' }, root);
    const p2 = createActivatedRouteSnapshot({ path: 'edit' }, p1);

    const path = getRoutePath(p2);

    expect(path).toBe('/topics/:id/edit');
  });

  it('getRouteParams gets the current snapshot params', () => {
    const c1 = createActivatedRouteSnapshot({ path: 'topics' }, null, [], { id: 1 });
    const root = createActivatedRouteSnapshot({ path: 'posts' }, null, [c1], { age: 20 });

    const params = getRouteParams(root, {});

    expect(params.id).toBe(1);
    expect(params.age).toBe(20);
  });
});
