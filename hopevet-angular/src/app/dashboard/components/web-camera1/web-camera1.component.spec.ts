import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebCamera1Component } from './web-camera1.component';

describe('WebCamera1Component', () => {
  let component: WebCamera1Component;
  let fixture: ComponentFixture<WebCamera1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebCamera1Component]
    });
    fixture = TestBed.createComponent(WebCamera1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
