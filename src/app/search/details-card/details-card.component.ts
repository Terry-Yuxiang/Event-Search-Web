import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {EventsComponent} from "./events/events.component";
@Component({
  selector: 'app-details-card',
  templateUrl: './details-card.component.html',
  styleUrls: ['./details-card.component.css'],
})
export class DetailsCardComponent implements OnInit{

  @Input() detailsCardData: any;
  @Input() spotifyData: any;
  @Input() venueData: any;
  @Output() disableDetailsCard = new EventEmitter<string>();

  // Chang the color of favorite icon
  eventFavorite = false;

  favoriteData: any = { };

  @ViewChild('genreText') myText!: ElementRef;
  ngOnInit() {
    const eventId = this?.detailsCardData?.id;
    if(localStorage.getItem("csci571_work8_Hx7tL9fK") != null) {
      // @ts-ignore
      this.favoriteData = JSON.parse(localStorage.getItem("csci571_work8_Hx7tL9fK"));
      if(eventId in this.favoriteData) {
          this.eventFavorite = true;
      }
    }
  }


  clickFavorite() {
    let category = ""
    if(this.detailsCardData?.classifications[0]?.segment?.name && this.detailsCardData.classifications[0].segment.name !== 'Undefined') {
      category += this.detailsCardData.classifications[0].segment.name;
    }
    if(this.detailsCardData?.classifications[0]?.genre?.name && this.detailsCardData.classifications[0].genre.name !== 'Undefined') {
      category += " | " + this.detailsCardData.classifications[0].genre.name;
    }
    if(this.detailsCardData?.classifications[0]?.subGenre?.name && this.detailsCardData.classifications[0].subGenre.name !== 'Undefined') {
      category += " | " + this.detailsCardData.classifications[0].subGenre.name;
    }
    if(this.detailsCardData?.classifications[0]?.type?.name && this.detailsCardData.classifications[0].type.name !== 'Undefined') {
      category += " | " + this.detailsCardData.classifications[0].type.name;
    }
    if(this.detailsCardData?.classifications[0]?.subType?.name && this.detailsCardData.classifications[0].subType.name !== 'Undefined') {
      category += " | " + this.detailsCardData.classifications[0].subType.name;
    }
    const eventId = this?.detailsCardData?.id;
    if(this.eventFavorite == false) {
      const favoriteData = {
        "date" : this.detailsCardData?.dates?.start?.localDate,
        "event" : this.detailsCardData?.name,
        // "category" : this.detailsCardData?._embedded?.attractions?.[0]?.classifications?.[0]?.segment?.name,
        "category" : category,
        "venue" : this.detailsCardData?._embedded?.venues?.[0]?.name
      }
      if(localStorage.getItem("csci571_work8_Hx7tL9fK") != null) {
        // @ts-ignore
        this.favoriteData = JSON.parse(localStorage.getItem("csci571_work8_Hx7tL9fK"));
        this.favoriteData[eventId] = favoriteData;
      } else {
        this.favoriteData[eventId] = favoriteData;
      }
      // @ts-ignore
      if (typeof(Storage) !== "undefined") {
          // @ts-ignore
        localStorage.setItem("csci571_work8_Hx7tL9fK", JSON.stringify(this.favoriteData))
      } else {

      }
      alert("Event added to favorites!");
    } else  {
      // @ts-ignore
      this.favoriteData = JSON.parse(localStorage.getItem("csci571_work8_Hx7tL9fK"));
      delete this.favoriteData[eventId];
      localStorage.setItem("csci571_work8_Hx7tL9fK", JSON.stringify(this.favoriteData))
      alert("Event removed to favorites!");
    }
    this.eventFavorite = !this.eventFavorite;
  }
  goback() {
    this.disableDetailsCard.emit('Disappear the detail Card!!!');
  }
}
