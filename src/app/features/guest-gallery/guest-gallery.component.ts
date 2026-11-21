import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { EventCatalogService } from '../../core/services/event-catalog.service';
import { GuestSessionService } from '../../core/services/guest-session.service';
import { SessionAlbumService } from '../../core/services/session-album.service';

const SUPPORTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

interface SelectedImage {
  readonly file: File;
  readonly previewUrl: string;
}

@Component({
  imports: [RouterLink],
  templateUrl: './guest-gallery.component.html',
  styleUrl: './guest-gallery.component.scss',
})
export class GuestGalleryComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly events = inject(EventCatalogService);
  private readonly guestSession = inject(GuestSessionService);
  private readonly album = inject(SessionAlbumService);
  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('eventSlug'))),
    { initialValue: null },
  );
  readonly event = computed(() => this.events.findBySlug(this.slug()) ?? this.events.events[0]);
  readonly selected = signal<readonly SelectedImage[]>([]);
  readonly errors = signal<readonly string[]>([]);
  readonly isConfirming = signal(false);
  readonly remaining = computed(() =>
    Math.max(0, this.event().guestPhotoLimit - this.album.countForEvent(this.event().id)),
  );

  async selectFiles(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (!files.length) return;
    const errors: string[] = [];
    const additions: SelectedImage[] = [];
    let available = this.remaining() - this.selected().length;
    for (const file of files) {
      if (!SUPPORTED_TYPES.has(file.type)) {
        errors.push(`${file.name}: Format gambar tidak disokong.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`${file.name}: Saiz gambar melebihi 10 MB.`);
        continue;
      }
      if (available <= 0) {
        errors.push(`${file.name}: Had gambar dicapai.`);
        continue;
      }
      const previewUrl = URL.createObjectURL(file);
      if (!(await this.canPreview(previewUrl))) {
        URL.revokeObjectURL(previewUrl);
        errors.push(`${file.name}: Gambar tidak dapat dipratonton.`);
        continue;
      }
      additions.push({ file, previewUrl });
      available--;
    }
    this.selected.update((current) => [...current, ...additions]);
    this.errors.set(errors);
  }

  remove(index: number): void {
    const item = this.selected()[index];
    if (!item) return;
    URL.revokeObjectURL(item.previewUrl);
    this.selected.update((items) => items.filter((_, itemIndex) => itemIndex !== index));
  }
  cancel(): void {
    this.clearSelections();
    void this.router.navigate(['/e', this.event().slug, 'guest']);
  }
  confirm(): void {
    if (!this.selected().length || this.isConfirming()) return;
    this.isConfirming.set(true);
    const name = this.guestSession.nameForEvent(this.event().id).trim();
    if (!name) {
      this.errors.set(['Masukkan nama anda di pusat kenangan tetamu dahulu.']);
      this.isConfirming.set(false);
      return;
    }
    for (const item of this.selected())
      this.album.add(this.event().id, item.file, name, this.event().guestPhotoLimit, 'gallery');
    this.clearSelections();
    this.isConfirming.set(false);
    void this.router.navigate(['/e', this.event().slug, 'guest', 'album']);
  }
  ngOnDestroy(): void {
    this.clearSelections();
  }
  private clearSelections(): void {
    this.selected().forEach((item) => URL.revokeObjectURL(item.previewUrl));
    this.selected.set([]);
  }
  private canPreview(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
      image.src = url;
    });
  }
}
