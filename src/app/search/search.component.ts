import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TableComponent} from "./table/table.component";
import {SearchFormComponent} from "./search-form/search-form.component";
import {SharedDataService} from "../shared/shared-data.service"

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  // events table create using data
  searchTableData: any;
  noResult = false;
  searchTableVisible = false;
  detailCardVisible = false;
  detailsCardData: any;
  spotifyData: any;
  venueData: any;
  constructor(private sharedDataService: SharedDataService) {
  }

  @ViewChild(SearchFormComponent) searchFormComponent!: SearchFormComponent;
  @ViewChild(TableComponent) tableComponent!: TableComponent;

  showTable(data: any) {
    console.log(data);
    this.detailCardVisible = false;
    this.searchTableData = this.sharedDataService.getEventsTableData();
    this.searchTableVisible = true;
    if(this.searchTableData.length == 0) {
      this.noResult = true;
    } else {
      this.noResult = false;
    }

    console.log();
  }

  resetPage(data: any) {
    console.log(data);
    this.searchTableVisible = false;
    // this.searchTableData = null;
    this.noResult = false;
    this.detailCardVisible = false;
  }

  async createDetailsCard(data: any) {
    console.log(data);
    this.searchTableVisible = false;
    this.detailCardVisible = true;
    this.detailsCardData = await this.sharedDataService.getDetailsCardData();
    this.spotifyData = this.sharedDataService.getSpotifyList();
    this.venueData = this.sharedDataService.getVenueData();
    console.log(this.venueData);
    console.log(this.sharedDataService.getVenueData());
    // console.log(this.spotifyData);
  }


  disableDetialCard(data: any) {
    console.log(data);
    this.detailCardVisible = false;
    this.searchTableVisible = true;
  }



}
