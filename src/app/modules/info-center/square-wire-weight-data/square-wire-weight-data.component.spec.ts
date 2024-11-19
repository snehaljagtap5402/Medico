import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareWireWeightDataComponent } from './square-wire-weight-data.component';

describe('SquareWireWeightDataComponent', () => {
  let component: SquareWireWeightDataComponent;
  let fixture: ComponentFixture<SquareWireWeightDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SquareWireWeightDataComponent]
    });
    fixture = TestBed.createComponent(SquareWireWeightDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
