import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID, PlatformRef } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'lodash';

@Component({
  selector: 'password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss']
})
export class PasswordStrengthComponent {
  @Input() password: string = '';
  public isBrowser: boolean = false;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: PlatformRef,
    private readonly router: Router,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    if (!this.router.url.includes('onboard')) return;

    const body = first(this.document.getElementsByTagName('body'));
    body?.classList.add('onboard-bg-layer');
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    if (!this.router.url.includes('onboard')) return;

    const body = first(this.document.getElementsByTagName('body'));
    body?.classList.remove('onboard-bg-layer');
  }

  get hasLowerCase() {
    return /[a-z]/g.test(this.password);
  }

  get hasUpperCase() {
    return /[A-Z]/g.test(this.password);
  }

  get hasNumber() {
    return /[\d]/g.test(this.password);
  }

  get hasSpecialCharacter() {
    return /[^A-Za-z0-9\s]/.test(this.password);
  }
}
