import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, PlatformRef } from '@angular/core';
import { first } from 'lodash';

@Component({
  selector: 'app-form-outline',
  templateUrl: './form-outline.component.html',
  styleUrls: ['./form-outline.component.scss']
})
export class FormOutlineComponent {
  public isBrowser: boolean = false;

  constructor(@Inject(DOCUMENT) public document: Document, @Inject(PLATFORM_ID) private readonly platformId: PlatformRef) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    const body = first(this.document.getElementsByTagName('body'));
    body?.classList.add('onboard-bg-layer');
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    const body = first(this.document.getElementsByTagName('body'));
    body?.classList.remove('onboard-bg-layer');
  }
}