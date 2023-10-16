import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { SharedDataService } from '../../shared/shared-data.service';
import {debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter} from 'rxjs/operators';
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})


export class SearchFormComponent implements OnInit{

  //
  // searchEventsControl = new FormControl();
  filterEvents: any;  // Store data of auto complete
  isLoading = false;
  minLengthTerm = 1;
  // selectEvents: any = "";

  //
  @Output() submitClicked = new EventEmitter<string>();
  @Output() resetPage = new EventEmitter<string>();
  showTable() {
    this.submitClicked.emit('searchForm组件发出了事件');
  }
  resetWholePage() {
    this.resetPage.emit('Request to reset the page!');
  }





  searchForm: FormGroup;
  isLocationDisabled: boolean = false;
  autoLocationInput = '';


  constructor(private formBuilder: FormBuilder, private http: HttpClient, private sharedDataService: SharedDataService) {
      this.searchForm = new FormGroup({
      inputKeyword: new FormControl('', []),
      inputDistance: new FormControl('10', []),
      inputCategory: new FormControl('Default', []),
      inputLocation: new FormControl('', []),
      isAutoLocation: new FormControl(false, []),
    });
    // @ts-ignore
    this.searchForm.get('isAutoLocation').valueChanges.subscribe((isChecked) => {
      if (isChecked) {
        // @ts-ignore
        this.searchForm.get('inputLocation').disable();
      } else {
        // @ts-ignore
        this.searchForm.get('inputLocation').enable();
      }
    });
  }


  @ViewChild('keywordCheck', {static: false}) keywordCheck!: ElementRef<HTMLInputElement>;
  @ViewChild('locationCheck', {static: false}) locationCheck!: ElementRef<HTMLInputElement>;


  autoLocationCheck() {
    if (!this.isLocationDisabled) {
      this.isLocationDisabled = !this.isLocationDisabled;
      const url = 'https://ipinfo.io/?token=f4781763c0d86b';
      this.http.get(url).subscribe((data: any) => {
        this.autoLocationInput = data.loc;
        // @ts-ignore
        this.searchForm.get("inputLocation").setValue("");
      });
    } else {
      this.isLocationDisabled = !this.isLocationDisabled;
      this.autoLocationInput = '';
    }
  }

  submitData() {
    this.locationCheck.nativeElement.reportValidity();
    this.keywordCheck.nativeElement.reportValidity();
    if(this.searchForm.get("inputKeyword")?.value != "" && (this.searchForm.get("inputLocation")?.value != "" || this.searchForm.get("isAutoLocation")?.value)) {
      let keyword;
      if(typeof this.searchForm.get("inputKeyword")?.value == "string") {
         keyword = "keyword=" + this.searchForm.get("inputKeyword")?.value;
      } else  {
         keyword = "keyword=" + this.searchForm.get("inputKeyword")?.value.name;
      }
      const distance = "&distance=" + this.searchForm.get("inputDistance")?.value;
      const category = "&category=" + this.searchForm.get("inputCategory")?.value;
      const location = "&location=" + this.searchForm.get("inputLocation")?.value;
      const checkbox = this.searchForm.get("isAutoLocation")?.value;
      let url;
      if(!checkbox) {
        url = "/events-search?" + keyword + distance + category + location;
      } else {
        url = "/events-search?" + keyword + distance + category + "&location=" + this.autoLocationInput;
      }
      // console.log(url)
      this.http.get(url).subscribe((data: any) => {
        this.sharedDataService.setEventsTableData(data);
        console.log(data);
        console.log(this.sharedDataService.getEventsTableData());
        this.showTable();
        // this.sharedDataService.displayTable();
      });
    }
    console.log(this.searchForm.get("inputKeyword")?.value);
    console.log(this.searchForm.get("inputDistance")?.value);
    console.log(this.searchForm.get("inputCategory")?.value);
    console.log(this.searchForm.get("inputLocation")?.value);
    console.log(this.searchForm.get("isAutoLocation")?.value);

  }

  resetForm() {
    this.searchForm.setValue({
      inputKeyword: '',
      inputDistance: '10',
      inputCategory: 'Default',
      inputLocation: '',
      isAutoLocation: false
    });
    this.filterEvents = [];
    this.autoLocationInput = '';
    this.isLocationDisabled = false;
    this.isLoading = false;
    this.resetWholePage();
  }


// aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

  onSelected(selectedOption: any) {
    console.log(selectedOption.option.value.name);
    // this.selectEvents = selectedOption.option.value.name;
    // const selectEvent : string =  selectedOption.option.value.name
    // @ts-ignore
    // console.log(typeof this.searchForm.get("inputKeyword")?.value.name);
  }

  displayWith(value: any) {
    // return value?.Title;
    return value?.name;
  }

  ngOnInit() {
    this.searchForm.get("inputKeyword")?.valueChanges
    // this.searchEventsControl.valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          // this.errorMsg = "";
          this.filterEvents = [];
          this.isLoading = true;
        }),
        // switchMap(value => this.http.get('http://www.omdbapi.com/?apikey=' + API_KEY + '&s=' + value)
        // switchMap(value => this.http.get('https://app.ticketmaster.com/discovery/v2/suggest?apikey=' + TICKMASTER_API_KEY + '&keyword=?' + value)
        switchMap(value => this.http.get('/auto-complete?word=' + value)

          // https://app.ticketmaster.com/discovery/v2/suggest?apikey=FzUucPDqpjq3Y4E0IqIrdM9BFuHmJAEi&keyword=?[taylor]
          // https://app.ticketmaster.com/discovery/v2/suggest?apikey=YOUR_API_KEY&keyword=?[KEYWORD]
          .pipe(
            // 注释以后可以一直loading
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      // .subscribe((data: any) => {
      //   if (data['Search'] == undefined) {
      //     this.errorMsg = data['Error'];
      //     this.filteredMovies = [];
      //   } else {
      //     this.errorMsg = "";
      //     this.filteredMovies = data['Search'];
      //   }
      //   console.log(this.filteredMovies);
      // });
      .subscribe((data: any) => {
        if (data?.['_embedded']?.['attractions'] == undefined) {
          // this.errorMsg = data['Error'];
          this.filterEvents = [];
        } else {
          // this.errorMsg = "";
          this.filterEvents = data?.['_embedded']?.['attractions'];
        }
        console.log(this.filterEvents);
      });

  }
//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
}
