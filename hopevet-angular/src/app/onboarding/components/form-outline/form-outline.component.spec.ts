import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOutlineComponent } from './form-outline.component';

describe('FormOutlineComponent', () => {
  let component: FormOutlineComponent;
  let fixture: ComponentFixture<FormOutlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormOutlineComponent]
    });
    fixture = TestBed.createComponent(FormOutlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
