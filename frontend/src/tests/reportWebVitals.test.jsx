import reportWebVitals from '../reportWebVitals';

describe('reportWebVitals', () => {
  it('does not throw when called with no arguments', () => {
    expect(() => reportWebVitals()).not.toThrow();
  });

  it('does not throw when called with a valid callback', () => {
    const callback = jest.fn();
    expect(() => reportWebVitals(callback)).not.toThrow();
  });
});
