import { Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { EventCatalogService } from '../../core/services/event-catalog.service';
import { GuestSessionService } from '../../core/services/guest-session.service';
import { SessionAlbumService } from '../../core/services/session-album.service';
import { CameraCaptureComponent } from '../../shared/camera-capture/camera-capture.component';

@Component({
  imports: [CameraCaptureComponent, RouterLink],
  templateUrl: './guest-navigation.component.html',
  styleUrl: './guest-navigation.component.scss',
})
export class GuestExperienceComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly eventCatalog = inject(EventCatalogService);
  private readonly guestSession = inject(GuestSessionService);
  private readonly sessionAlbum = inject(SessionAlbumService);
  private readonly eventSlug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('eventSlug'))),
    { initialValue: null },
  );
  private readonly camera = viewChild.required(CameraCaptureComponent);

  readonly event = computed(
    () => this.eventCatalog.findBySlug(this.eventSlug()) ?? this.eventCatalog.events[0],
  );
  readonly photos = computed(() =>
    this.sessionAlbum.photos().filter((photo) => photo.eventId === this.event().id),
  );
  readonly guestName = computed(() => this.guestSession.nameForEvent(this.event().id));

  addCapturedPhoto(image: Blob): void {
    this.sessionAlbum.add(
      this.event().id,
      image,
      this.guestName().trim(),
      this.event().guestPhotoLimit,
    );
  }

  updateGuestName(event: Event): void {
    this.guestSession.updateName(this.event().id, (event.target as HTMLInputElement).value);
  }

  openCamera(): void {
    this.camera().openCamera();
  }
}
