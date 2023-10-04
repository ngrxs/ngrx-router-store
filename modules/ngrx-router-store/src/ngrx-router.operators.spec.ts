import { Action } from '@ngrx/store';

import { Subject } from 'rxjs';

import * as act from './state/ngrx-router.actions';
import { ofRoute, onLeaveRoute } from './ngrx-router.operators';

describe('op:', () => {
  it('ofRoute should filter only routes', () => {
    const subject = new Subject<Action>();
    const urls: string[] = [];
    const routeChange = (url: string, routes: string[]) =>
      act.routeChange({ url, routes, params: {}, queryParams: {} });
    const subs = subject
      .pipe(ofRoute(['/topics/:id/posts', '/topics/:id/create']))
      .subscribe((a) => {
        urls.push(a.url);
      });

    subject.next({ type: 'TEST0' });
    subject.next({ type: 'TEST', url: '/1' } as Action);
    subject.next(routeChange('/2', []));
    subject.next(routeChange('/3', ['/topics/:id/posts']));
    subject.next(routeChange('/4', ['/topics/:id']));
    subject.next(routeChange('/5', ['/topics', '/topics/:id/create']));
    subject.next(routeChange('/6', ['/topics', '/topics/:id', '/topics/:id/posts/:pid']));

    subs.unsubscribe();
    subject.complete();

    expect(urls).toHaveLength(2);
    expect(urls).toContain('/3');
    expect(urls).toContain('/5');
  });

  it('onLeaveRoute should filter only routes', () => {
    const subject = new Subject<Action>();
    const urls: string[] = [];
    const subs = subject.pipe(onLeaveRoute(['/topics/:id', '/topics/create'])).subscribe((a) => {
      urls.push(a.url);
    });

    subject.next({ type: 'TEST0' });
    subject.next({ type: 'TEST', url: '/1' } as Action);
    subject.next(act.routeLeave({ url: '/2', route: '' }));
    subject.next(act.routeLeave({ url: '/3', route: '/topics/:id' }));
    subject.next(act.routeLeave({ url: '/5', route: '/topics' }));

    subs.unsubscribe();
    subject.complete();

    expect(urls).toHaveLength(1);
    expect(urls).toContain('/3');
  });
});
