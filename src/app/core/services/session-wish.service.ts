import { Injectable, signal } from '@angular/core';
import { SessionWish } from '../models/session-wish.model';

@Injectable({ providedIn: 'root' })
export class SessionWishService {
  private readonly wishState = signal<readonly SessionWish[]>([]);
  private nextWishId = 0;

  readonly wishes = this.wishState.asReadonly();

  add(eventId: string, guestName: string, message: string): void {
    this.wishState.update((wishes) => [
      ...wishes,
      {
        id: `session-wish-${++this.nextWishId}`,
        eventId,
        guestName,
        message,
        createdAt: new Date(),
      },
    ]);
  }
}
