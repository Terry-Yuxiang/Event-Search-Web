import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './search/search.component';
import { FavoriteComponent } from './favorite/favorite.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


import { RouterModule, Routes} from "@angular/router";
import { SearchFormComponent } from './search/search-form/search-form.component';
import { NavComponent } from './nav/nav.component';
import { BlankComponent } from './favorite/blank/blank.component';
import { HttpClientModule } from '@angular/common/http';
import { TableComponent } from './search/table/table.component';
import { DetailsCardComponent } from './search/details-card/details-card.component';
import { CarouselComponent } from './search/details-card/carousel/carousel.component';
import { NavigationComponent } from './search/details-card/navigation/navigation.component';
import { EventsComponent } from './search/details-card/events/events.component';
import { ArtistComponent } from './search/details-card/artist/artist.component';
import { VenueComponent } from './search/details-card/venue/venue.component';
import { FavoriteEventsComponent } from './favorite/favorite-events/favorite-events.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { NoResultTableComponent } from './search/no-result-table/no-result-table.component';
import { GoogleMapsModule } from '@angular/google-maps'

let routes : Routes = [
  {path : '', redirectTo: '/search', pathMatch: 'full'},
  {path : 'search', component: SearchComponent},
  {path : 'favorite', component: FavoriteComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    FavoriteComponent,
    SearchFormComponent,
    NavComponent,
    BlankComponent,
    TableComponent,
    DetailsCardComponent,
    CarouselComponent,
    NavigationComponent,
    EventsComponent,
    ArtistComponent,
    VenueComponent,
    FavoriteEventsComponent,
    NoResultTableComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        FormsModule,
        RouterModule.forRoot(routes),
        HttpClientModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        // Material Module
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        GoogleMapsModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
