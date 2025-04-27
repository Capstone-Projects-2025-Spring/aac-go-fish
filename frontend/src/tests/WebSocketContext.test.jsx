import React, { useContext } from 'react';
import { render, act } from '@testing-library/react';
import { WebSocketProvider, WebSocketContext, useWebSocket } from '../WebSocketContext';

describe('WebSocketContext and useWebSocket', () => {
  let wsInstances = [];
  const originalWebSocket = global.WebSocket;

  beforeAll(() => {
    global.WebSocket = class {
      constructor(url) {
        this.url = url;
        this.send = jest.fn();
        this.close = jest.fn();
        wsInstances.push(this);
      }
      onmessage = null;
    };
  });

  afterAll(() => {
    global.WebSocket = originalWebSocket;
  });

  it('provides send method that serializes and sends on underlying WebSocket', () => {
    let contextSend;
    const TestComponent = () => {
      const { send } = useContext(WebSocketContext);
      contextSend = send;
      return null;
    };

    render(
      <WebSocketProvider>
        <TestComponent />
      </WebSocketProvider>
    );

    expect(wsInstances.length).toBe(1);
    const ws = wsInstances[0];
    const obj = { foo: 'bar' };
    act(() => contextSend(obj));
    expect(ws.send).toHaveBeenCalledWith(JSON.stringify(obj));
  });

  it('calls listener registered via useWebSocket on incoming messages', () => {
    let received = null;
    const ListenerComponent = () => {
      useWebSocket((message) => {
        received = message;
      });
      return null;
    };

    render(
      <WebSocketProvider>
        <ListenerComponent />
      </WebSocketProvider>
    );

    const ws = wsInstances[wsInstances.length - 1];
    const payload = { data: { test: 123 } };
    act(() => {
      ws.onmessage({ data: JSON.stringify(payload) });
    });
    expect(received).toEqual(payload);
  });

  it('removes listener on unmount to avoid memory leaks', () => {
    let received = null;
    const Listener = () => {
      useWebSocket((message) => {
        received = message;
      });
      return null;
    };

    const { unmount } = render(
      <WebSocketProvider>
        <Listener />
      </WebSocketProvider>
    );
    const ws = wsInstances[wsInstances.length - 1];
    unmount();
    act(() => {
      ws.onmessage({ data: JSON.stringify({ data: 'nope' }) });
    });
    expect(received).toBeNull();
  });
});
