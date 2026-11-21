import { Component, computed, inject, input, signal } from '@angular/core';
import { SessionWishService } from '../../core/services/session-wish.service';

@Component({
  selector: 'app-guest-wishes',
  templateUrl: './guest-wishes.component.html',
  styleUrl: './guest-wishes.component.scss',
})
export class GuestWishesComponent {
  private readonly sessionWishes = inject(SessionWishService);

  readonly eventId = input.required<string>();
  readonly guestName = input.required<string>();
  protected readonly message = signal('');
  protected readonly error = signal('');
  readonly wishes = computed(() =>
    this.sessionWishes.wishes().filter((wish) => wish.eventId === this.eventId()),
  );

  updateMessage(event: Event): void {
    this.message.set((event.target as HTMLTextAreaElement).value);
  }

  submit(event: SubmitEvent): void {
    event.preventDefault();
    const guestName = this.guestName().trim();
    const message = this.message().trim();
    if (!guestName) {
      this.error.set('Enter your name above before sending a wish.');
      return;
    }
    if (!message) {
      this.error.set('Write a wish before sending it.');
      return;
    }
    if (message.length > 500) {
      this.error.set('Keep your wish to 500 characters or fewer.');
      return;
    }

    this.sessionWishes.add(this.eventId(), guestName, message);
    this.message.set('');
    this.error.set('');
  }
}
