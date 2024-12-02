import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-shipment-details-modal',
  templateUrl: './shipment-details-modal.component.html',
  styleUrls: ['./shipment-details-modal.component.scss']
})
export class ShipmentDetailsModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
