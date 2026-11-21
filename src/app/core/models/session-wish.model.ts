export interface SessionWish {
  readonly id: string;
  readonly eventId: string;
  readonly guestName: string;
  readonly message: string;
  readonly createdAt: Date;
}
