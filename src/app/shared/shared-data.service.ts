import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  eventsTableData: any;
  detailsCardData:any;
  spotifyList = new Map<string, any>();

  venueData: any;

  setEventsTableData(data: any) {
    this.eventsTableData = data;
  }
  getEventsTableData(): any {
    return this.eventsTableData;
  }
  setDetailsCardData(data: any) {
    this.detailsCardData = data;
  }

  getDetailsCardData() {
    return this.detailsCardData;
  }

  putInSpotifyList(key:string, data:any) {
    this.spotifyList.set(key, data);
  }

  getSpotifyList() {
    return this.spotifyList;
  }

  clearSpotifyList() {
  }



  // putInArtistList(data:any) {
  //   // @ts-ignore
  //   this.artistList.push(data);
  // }
  //
  // getArtistList() {
  //   return this.artistList;
  // }
  //
  // clearArtistList() {
  //   this.artistList.splice(0,this.artistList.length);
  // }

  setVenueData(data:any) {
    this.venueData = data;
  }

  getVenueData() {
    return this.venueData;
  }

}
