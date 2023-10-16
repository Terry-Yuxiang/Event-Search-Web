import {Component, Input, Output} from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  @Input() detailsCardData: any;
  @Output() getGenreText: any
  get twitterShare(): string {
    const encodeTwitter = encodeURIComponent(this.detailsCardData?.name || '');
    const ticketmasterUrl = this.detailsCardData?.url;
    return `https://twitter.com/intent/tweet?text=Check ${encodeTwitter} on Ticketmaster&url=${ticketmasterUrl}`;
  }

}
