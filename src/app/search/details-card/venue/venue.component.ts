import {Component, Input} from '@angular/core';
import {ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent {

  @Input() venueData: any;

  OpenHoursCollapsed = true;
  GenralRulesCollapsed = true;
  ChildRuleCollapsed = true;
  private latitude: any;
  private longitude: any;

  marker = {position: { lat: 38.9987208, lng: -77.2538699 },};
  mapOptions: google.maps.MapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom : 14
  }

      OpenHoursFolder() {
    this.OpenHoursCollapsed = !this.OpenHoursCollapsed;
  }

  GeneralRulesFolder() {
    this.GenralRulesCollapsed = !this.GenralRulesCollapsed;
  }

  ChildRuleFolder() {
    this.ChildRuleCollapsed = !this.ChildRuleCollapsed;
  }

  closeResult = '';

  constructor(config: NgbModalConfig, private modalService: NgbModal, private http: HttpClient) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  async open(content: any) {
    const locationName = this.venueData?._embedded?.venues?.[0]?.address?.line1 + this.venueData?._embedded?.venues?.[0]?.city?.name + this.venueData?._embedded?.venues?.[0]?.state?.name
    const geoKey = 'AIzaSyCbF7-MBwO2GFg3qP-0VTk1n-DJIfcWuT8';
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationName}&key=${geoKey}`;
    await this.http.get(geoUrl).subscribe(async (data: any) => {
      this.latitude = data.results[0].geometry.location.lat;
      this.longitude = data.results[0].geometry.location.lng;
      this.marker = {
        position: {lat: this.latitude, lng: this.longitude},
      }
      this.mapOptions = {
        center: {lat: this.latitude, lng: this.longitude},
        zoom: 14
      }
    });


    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }






}
