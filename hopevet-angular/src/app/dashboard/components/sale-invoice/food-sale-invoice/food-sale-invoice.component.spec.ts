import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodSaleInvoiceComponent } from './food-sale-invoice.component';

describe('FoodSaleInvoiceComponent', () => {
  let component: FoodSaleInvoiceComponent;
  let fixture: ComponentFixture<FoodSaleInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoodSaleInvoiceComponent]
    });
    fixture = TestBed.createComponent(FoodSaleInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
