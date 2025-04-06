import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTilesComponent } from './home-tiles.component';

describe('HomeTilesComponent', () => {
  let component: HomeTilesComponent;
  let fixture: ComponentFixture<HomeTilesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeTilesComponent]
    });
    fixture = TestBed.createComponent(HomeTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
