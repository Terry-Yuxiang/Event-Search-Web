import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-favorite-events',
  templateUrl: './favorite-events.component.html',
  styleUrls: ['./favorite-events.component.css']
})
export class FavoriteEventsComponent implements OnInit{


  @Output() showFavorite = new EventEmitter<string>();
  @Output() showBlank = new EventEmitter<string>();
  @Input() noFavoriteEvents:any;
  favoriteData: any = {}
  arrayData: any = [];
  ngOnInit() {
    if(localStorage.getItem("csci571_work8_Hx7tL9fK") == null || localStorage.getItem("csci571_work8_Hx7tL9fK") == '{}') {
      this.favoriteData = {};
      this.arrayData = [];
      // this.showBlank.emit("Nothing aviliable");
      this.noFavoriteEvents = true;
    } else {
      // @ts-ignore
      this.favoriteData = JSON.parse(localStorage.getItem("csci571_work8_Hx7tL9fK"));
      this.arrayData = Object.keys(this.favoriteData).map((key) => ({ key: key, value: this.favoriteData[key] }));
      // this.showFavorite.emit("You have local favorites!!!");
      this.noFavoriteEvents = false;
    }
  }

  deleteFavorite(data:any) {
    delete this.favoriteData[data?.key];
    this.arrayData = Object.keys(this.favoriteData).map((key) => ({ key: key, value: this.favoriteData[key] }));
    if(this.arrayData.length == 0) {
      // this.showBlank.emit("Nothing aviliable");
      this.noFavoriteEvents = true;
    }
    localStorage.setItem("csci571_work8_Hx7tL9fK", JSON.stringify(this.favoriteData));
    alert("Removed from favorites!")
  }
}
