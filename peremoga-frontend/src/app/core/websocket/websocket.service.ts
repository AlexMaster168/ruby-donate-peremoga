import { Injectable, signal } from '@angular/core';
import { createConsumer } from '@rails/actioncable';

export interface CableMessage {
  type: string;
  data: any;
}

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private consumer: ReturnType<typeof createConsumer> | null = null;
  private subscriptions = new Map<string, any>();

  connected = signal(false);

  connect(token: string) {
    if (this.consumer) return;

    this.consumer = createConsumer(`/cable?token=${token}`);

    this.consumer.connection.monitor?.connected?.subscribe?.(() => {
      this.connected.set(true);
    });

    this.consumer.connection.monitor?.disconnected?.subscribe?.(() => {
      this.connected.set(false);
    });

    this.connected.set(true);
  }

  disconnect() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();
    this.consumer?.disconnect();
    this.consumer = null;
    this.connected.set(false);
  }

  subscribeToNotifications(callback: (message: CableMessage) => void) {
    if (!this.consumer) return;

    const channel = this.consumer.subscriptions.create('NotificationsChannel', {
      received: (message: CableMessage) => callback(message)
    });

    this.subscriptions.set('notifications', channel);
    return channel;
  }

  subscribeToTicket(ticketId: string, callback: (message: CableMessage) => void) {
    if (!this.consumer) return;

    const channel = this.consumer.subscriptions.create(
      { channel: 'TicketsChannel', ticket_id: ticketId },
      {
        received: (message: CableMessage) => callback(message)
      }
    );

    this.subscriptions.set(`ticket_${ticketId}`, channel);
    return channel;
  }

  unsubscribeFromTicket(ticketId: string) {
    const channel = this.subscriptions.get(`ticket_${ticketId}`);
    if (channel) {
      channel.unsubscribe();
      this.subscriptions.delete(`ticket_${ticketId}`);
    }
  }
}
