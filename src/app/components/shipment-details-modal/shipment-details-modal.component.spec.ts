import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentDetailsModalComponent } from './shipment-details-modal.component';

describe('ShipmentDetailsModalComponent', () => {
  let component: ShipmentDetailsModalComponent;
  let fixture: ComponentFixture<ShipmentDetailsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShipmentDetailsModalComponent]
    });
    fixture = TestBed.createComponent(ShipmentDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
