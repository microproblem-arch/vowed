import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { EventCatalogService } from '../../core/services/event-catalog.service';
import { GuestSessionService } from '../../core/services/guest-session.service';
import { GuestWishesComponent } from '../../shared/guest-wishes/guest-wishes.component';
@Component({
  imports: [GuestWishesComponent, RouterLink],
  templateUrl: './guest-wishes-page.component.html',
  styleUrl: './guest-wishes-page.component.scss',
})
export class GuestWishesPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly events = inject(EventCatalogService);
  private readonly guest = inject(GuestSessionService);
  private readonly slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('eventSlug'))), {
    initialValue: null,
  });
  readonly event = computed(() => this.events.findBySlug(this.slug()) ?? this.events.events[0]);
  readonly guestName = computed(() => this.guest.nameForEvent(this.event().id));
}
