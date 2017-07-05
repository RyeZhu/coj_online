import { BeautifulPipe } from './beautiful.pipe';

describe('BeautifulPipe', () => {
  it('create an instance', () => {
    const pipe = new BeautifulPipe();
    expect(pipe).toBeTruthy();
  });
});
