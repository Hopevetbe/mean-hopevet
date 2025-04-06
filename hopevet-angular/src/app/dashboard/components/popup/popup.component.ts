import { Component, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  @Input() showCloseIcon!:boolean;
  @Input() showComponent!: boolean;
  @Input() size = 'md';
  @Input() showBorderRadius!:boolean;
  @Input() popupNavigationEnabled!: boolean;
  @Input() grayBgEnabled!:boolean;
  @Output() showComponentChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() popupClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * constructor
   */
  constructor(private renderer: Renderer2){
    this.renderer.addClass(document.body, 'model-open');
  }
  /**
   * OnDestroy
   */
  ngOnDestroy():void{
    this.renderer.removeClass(document.body, 'model-open');
  }
  closePopup(){
    this.showComponent = false;
    this.showComponentChange.emit(this.showComponent);
    this.popupClosed.emit();
  }
  @HostListener('document:keyup.esc', ['$event'])
  handleKeyUp(): void{
    this.closePopup();
  }

}
