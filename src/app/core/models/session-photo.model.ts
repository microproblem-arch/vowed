export interface SessionPhoto {
  readonly id: string;
  readonly eventId: string;
  readonly guestName: string;
  readonly source: 'camera' | 'gallery';
  readonly objectUrl: string;
  readonly capturedAt: Date;
}
