declare module '@rails/actioncable' {
  export function createConsumer(url?: string): Cable;
  export interface Cable {
    connection: Connection;
    subscriptions: Subscriptions;
    disconnect(): void;
  }
  export interface Connection {
    connect(): void;
    disconnect(): void;
    monitor?: {
      connected?: { subscribe: (callback: () => void) => void };
      disconnected?: { subscribe: (callback: () => void) => void };
    };
  }
  export interface Subscriptions {
    create(channelName: string | Record<string, any>, mixin?: Record<string, any>): Subscription;
  }
  export interface Subscription {
    unsubscribe(): void;
    perform(action: string, data?: Record<string, any>): void;
  }
}
