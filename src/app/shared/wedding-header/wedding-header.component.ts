import { Component, input } from '@angular/core';
import { WeddingEvent } from '../../core/models/wedding-event.model';

@Component({
  selector: 'app-wedding-header',
  templateUrl: './wedding-header.component.html',
  styleUrl: './wedding-header.component.scss',
})
export class WeddingHeaderComponent {
  readonly event = input.required<WeddingEvent>();
}
