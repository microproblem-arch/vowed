import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { EventCatalogService } from '../../core/services/event-catalog.service';
import { SessionAlbumService } from '../../core/services/session-album.service';
@Component({
  imports: [RouterLink],
  templateUrl: './guest-album.component.html',
  styleUrl: './guest-album.component.scss',
})
export class GuestAlbumComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly events = inject(EventCatalogService);
  private readonly album = inject(SessionAlbumService);
  private readonly slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('eventSlug'))), {
    initialValue: null,
  });
  readonly event = computed(() => this.events.findBySlug(this.slug()) ?? this.events.events[0]);
  readonly photos = computed(() =>
    this.album.photos().filter((photo) => photo.eventId === this.event().id),
  );
  remove(id: string): void {
    this.album.remove(id);
  }
}
