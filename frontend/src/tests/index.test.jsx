describe('index.js entrypoint', () => {
  let rootMock;

  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = '<div id="root"></div>';
    rootMock = { render: jest.fn() };
    jest.doMock('react-dom/client', () => ({ createRoot: jest.fn().mockReturnValue(rootMock) }));
    jest.doMock('../reportWebVitals', () => jest.fn());
  });

  it('should create root and render App wrapped in WebSocketProvider', () => {
    const ReactDOM = require('react-dom/client');
    const reportWebVitals = require('../reportWebVitals');
    const { WebSocketProvider } = require('../WebSocketContext');
    const AppModule = require('../App');
    const AppComponent = AppModule.default || AppModule;

    require('../index.js');

    expect(ReactDOM.createRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(rootMock.render).toHaveBeenCalledTimes(1);
    const renderedElement = rootMock.render.mock.calls[0][0];
    expect(renderedElement.type).toBe(WebSocketProvider);
    const child = renderedElement.props.children;
    expect(child.type).toBe(AppComponent);
    expect(reportWebVitals).toHaveBeenCalled();
  });
});
