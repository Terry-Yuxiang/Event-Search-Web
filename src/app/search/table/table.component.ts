import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SharedDataService} from '../../shared/shared-data.service'
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {


  @Output() createDetailsCard = new EventEmitter<string>();
  @Input() searchTableData: any;

  constructor(private sharedDataService: SharedDataService, private http: HttpClient) {
    this.searchTableData = this.sharedDataService.getEventsTableData()

  }

  async getEventDetails(item: any) {
    this.sharedDataService.clearSpotifyList();
    const url = "/events-detail?word=" + item.id;
    await this.http.get(url).subscribe(async (data: any) => {
      console.log(data);
      this.sharedDataService.setDetailsCardData(data);
      if (data?._embedded?.attractions?.[0]?.classifications?.[0]?.segment?.name == 'Music') {
        await this.createSpotifyList(data);
      }
      await this.venueDetails(data?._embedded?.venues?.[0]?.name)
    });
  }

  async createSpotifyList(artistsList: any) {
    if (artistsList?._embedded?.attractions) {
      for (let artist of artistsList?._embedded?.attractions) {
        if (artist?.name) {
          const artistUrl = "/spotifyArtist?name=" + artist.name;
          this.http.get(artistUrl).subscribe((data: any) => {
            this.sharedDataService.putInSpotifyList(artist.name, data);

            const artistName = artist.name + "!@#$%^"
            const artistAlbums = "/spotifyArtistAlbums?id=" + data.artists?.items?.[0]?.uri.split(':')[2];
            // console.log(artistAlbums);
            this.http.get(artistAlbums).subscribe((album: any) => {
              this.sharedDataService.putInSpotifyList(artistName, album);
            });
          });
        }
      }
    }
  }

  async venueDetails(venueName: any) {
    const url = "https://app.ticketmaster.com/discovery/v2/venues?apikey=FzUucPDqpjq3Y4E0IqIrdM9BFuHmJAEi&keyword=" + venueName;
    await this.http.get(url).subscribe(async (data: any) => {
      this.sharedDataService.setVenueData(data);
      this.createDetailsCard.emit('Table want to give data to card!!!');
      // console.log(data);
    });
  }

}
