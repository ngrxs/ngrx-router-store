import { Action } from '@ngrx/store';

import { Subject } from 'rxjs';

import * as act from './state/ngrx-router.actions';
import { ofRoute, onLeaveRoute } from './ngrx-router.operators';

describe('op:', () => {
  it('ofRoute should filter only routes', () => {
    const subject = new Subject<Action>();
    const urls: string[] = [];
    const subs = subject
      .pipe(ofRoute(['/topics/:id/posts', '/topics/:id/create']))
      .subscribe((a) => {
        urls.push(a.url);
      });

    subject.next({ type: 'TEST0' });
    subject.next({ type: 'TEST', url: '/1' } as Action);
    subject.next(act.routeChange({ url: '/2', routes: [], params: {} }));
    subject.next(act.routeChange({ url: '/3', routes: ['/topics/:id/posts'], params: {} }));
    subject.next(act.routeChange({ url: '/4', routes: ['/topics/:id'], params: {} }));
    subject.next(
      act.routeChange({ url: '/5', routes: ['/topics', '/topics/:id/create'], params: {} })
    );
    subject.next(
      act.routeChange({
        url: '/6',
        routes: ['/topics', '/topics/:id', '/topics/:id/posts/:pid'],
        params: {}
      })
    );

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
