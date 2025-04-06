import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationInvoiceComponent } from './consultation-invoice.component';

describe('ConsultationInvoiceComponent', () => {
  let component: ConsultationInvoiceComponent;
  let fixture: ComponentFixture<ConsultationInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultationInvoiceComponent]
    });
    fixture = TestBed.createComponent(ConsultationInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
