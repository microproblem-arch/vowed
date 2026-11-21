import { Injectable } from '@angular/core';
import { MOCK_WEDDING_EVENTS } from '../data/mock-events';
import { WeddingEvent } from '../models/wedding-event.model';

@Injectable({ providedIn: 'root' })
export class EventCatalogService {
  readonly events = MOCK_WEDDING_EVENTS;

  findBySlug(slug: string | null): WeddingEvent | undefined {
    return this.events.find((event) => event.slug === slug && event.status === 'published');
  }
}
