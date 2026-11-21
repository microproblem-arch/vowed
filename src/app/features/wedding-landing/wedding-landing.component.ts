import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { EventCatalogService } from '../../core/services/event-catalog.service';
import { WeddingHeaderComponent } from '../../shared/wedding-header/wedding-header.component';

@Component({
  imports: [RouterLink, WeddingHeaderComponent],
  templateUrl: './wedding-invitation.component.html',
  styleUrl: './wedding-invitation.component.scss',
})
export class WeddingLandingComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly eventCatalog = inject(EventCatalogService);
  private readonly eventSlug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('eventSlug'))),
    { initialValue: null },
  );
  readonly event = computed(
    () => this.eventCatalog.findBySlug(this.eventSlug()) ?? this.eventCatalog.events[0],
  );
}
