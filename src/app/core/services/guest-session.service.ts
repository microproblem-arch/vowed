import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GuestSessionService {
  private readonly namesByEvent = signal<Readonly<Record<string, string>>>({});

  nameForEvent(eventId: string): string {
    return this.namesByEvent()[eventId] ?? '';
  }

  updateName(eventId: string, name: string): void {
    this.namesByEvent.update((names) => ({ ...names, [eventId]: name }));
  }
}
