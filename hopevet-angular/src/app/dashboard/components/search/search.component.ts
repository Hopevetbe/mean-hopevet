import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit,OnChanges{
  @Input() ownerList!:{id:string,name:string}[];
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() newlyAdded:EventEmitter<boolean>  = new EventEmitter<boolean>();
  @Output() touched:EventEmitter<boolean>  = new EventEmitter<boolean>();
  @Output() searchTermEmitted:EventEmitter<string>  = new EventEmitter<string>();
  filteredOptions: any[] = [];
  @Input() searchTerm: string = '';
  showDropdown: boolean = false;

  ngOnInit() {
    this.filteredOptions = this.ownerList;
  }
  ngOnChanges() {
    this.filteredOptions = this.ownerList;
  }

  onInputChange() {
    this.filteredOptions = this.ownerList.filter((option: {id:string,name:string}) =>
      option.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.showDropdown = this.filteredOptions.length > 0;
    this.newlyAdded.emit(this.filteredOptions.length === 0);
  }

  onOptionSelect(option: {id:string,name:string}) {
   // this.searchTerm = option.name;
    this.showDropdown = false;
    this.searchTermEmitted.emit(option.name);
    this.newItemEvent.emit(option);
  }
  blur(){
    this.touched.emit(this.searchTerm === '');
  }
}
