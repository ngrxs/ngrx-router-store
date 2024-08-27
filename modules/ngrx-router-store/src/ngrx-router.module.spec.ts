import { NgrxRouterStateModule } from './ngrx-router.module';

describe('NgrxRouterStateModule:', () => {
  it('should create', () => {
    const module = NgrxRouterStateModule.forRoot();
    expect(module).toBeTruthy();
  });
});
