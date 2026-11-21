import { Injectable, signal } from '@angular/core';
import { SessionPhoto } from '../models/session-photo.model';

@Injectable({ providedIn: 'root' })
export class SessionAlbumService {
  private readonly photoState = signal<readonly SessionPhoto[]>([]);
  private nextPhotoId = 0;

  readonly photos = this.photoState.asReadonly();

  countForEvent(eventId: string): number {
    return this.photoState().filter((photo) => photo.eventId === eventId).length;
  }

  add(
    eventId: string,
    image: Blob,
    guestName: string,
    photoLimit: number,
    source: SessionPhoto['source'] = 'camera',
  ): SessionPhoto | undefined {
    if (this.countForEvent(eventId) >= photoLimit) {
      return undefined;
    }

    const photo: SessionPhoto = {
      id: `session-photo-${++this.nextPhotoId}`,
      eventId,
      guestName,
      source,
      objectUrl: URL.createObjectURL(image),
      capturedAt: new Date(),
    };

    this.photoState.update((photos) => [...photos, photo]);
    return photo;
  }

  remove(photoId: string): void {
    const photo = this.photoState().find((candidate) => candidate.id === photoId);
    if (!photo) {
      return;
    }

    URL.revokeObjectURL(photo.objectUrl);
    this.photoState.update((photos) => photos.filter((candidate) => candidate.id !== photoId));
  }
}
