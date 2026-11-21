import { WeddingEvent } from '../models/wedding-event.model';

export const MOCK_WEDDING_EVENTS: readonly WeddingEvent[] = [
  {
    id: 'evt_najwa_farhan',
    slug: 'najwa-farhan',
    coupleNames: 'Najwa & Farhan',
    dateLabel: 'Saturday, 18 October 2026',
    venue: 'The Glasshouse, Kuala Lumpur',
    welcomeMessage:
      'We are so grateful you are here to celebrate the beginning of our next chapter.',
    coverImageUrl: '/images/najwa-farhan-cover.svg',
    guestPhotoLimit: 20,
    status: 'published',
  },
  {
    id: 'evt_amir_aisyah',
    slug: 'amir-aisyah',
    coupleNames: 'Amir & Aisyah',
    dateLabel: 'Sunday, 25 October 2026',
    venue: 'The Majestic Hotel, Kuala Lumpur',
    welcomeMessage: 'Thank you for joining us for a day of love, laughter, and cherished memories.',
    coverImageUrl: '/images/najwa-farhan-cover.svg',
    guestPhotoLimit: 20,
    status: 'published',
  },
];
