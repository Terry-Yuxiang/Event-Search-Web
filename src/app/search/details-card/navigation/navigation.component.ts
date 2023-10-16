import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  @Input() spotifyData: any;
  @Input() detailsCardData: any;
  @Input() venueData: any;
  activeTab: string = 'slide0';

  setActiveTab(slideId: string) {
    this.activeTab = slideId;
  }
}
