export interface WeddingEvent {
  readonly id: string;
  readonly slug: string;
  readonly coupleNames: string;
  readonly dateLabel: string;
  readonly welcomeMessage: string;
  readonly venue: string;
  readonly coverImageUrl: string;
  readonly guestPhotoLimit: number;
  readonly status: 'published' | 'draft';
}
