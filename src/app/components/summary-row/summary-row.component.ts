import { Component, OnInit } from '@angular/core';
import { ShipmentService } from '../shipment.service';
import { Shipment } from './shipment.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ShipmentDetailsModalComponent } from '../shipment-details-modal/shipment-details-modal.component';

@Component({
  selector: 'app-summary-row',
  templateUrl: './summary-row.component.html',
  styleUrls: ['./summary-row.component.scss'],
})
export class SummaryRowComponent {
  displayedColumns: string[] = [
    'shipmentId',
    'orderId',
    'status',
    'senderAddress',
    'receiverAddress',
    'trackingNumber',
    'shipmentDate',
    'action',
  ];

  summaryData: any[] = [];
  shipmentData: Shipment[] = [];
row: any;

  constructor(private shipmentService: ShipmentService , private dialog: MatDialog) {}

  ngOnInit(): void {
    console.log('I am here');
    console.log(this.summaryData);
    this.fetchShipments();
    this.fetchShipmentStatusCounts();
  }

  fetchShipments(): void {
    console.log('In fetchShipments');

    this.shipmentData = this.shipmentService.getAllShipments();
    this.shipmentService.getAllShipments().subscribe(
      (data: Shipment[]) => {
        console.log(data);
        this.shipmentData = data;
        console.log(this.shipmentData);
        return this.shipmentData;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching shipment data', error);
      }
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'status-completed';
      case 'IN_TRANSIT':
        return 'status-in-transit';
      case 'SHIPPED':
        return 'status-shipped';
      default:
        return '';
    }
  }
  

  fetchShipmentStatusCounts(): void {
    console.log('Fetching shipment counts by status...');
    const statuses: Array<'IN_TRANSIT' | 'SHIPPED' | 'COMPLETED'> = [
      'IN_TRANSIT',
      'SHIPPED',
      'COMPLETED',
    ];

    const statusImages: {
      [key in 'IN_TRANSIT' | 'SHIPPED' | 'COMPLETED']: string;
    } = {
      IN_TRANSIT: 'assets/transit.png',
      SHIPPED: 'assets/shipped.png',
      COMPLETED: 'assets/delivered.png',
    };

    const statusTitles: {
      [key in 'IN_TRANSIT' | 'SHIPPED' | 'COMPLETED']: string;
    } = {
      IN_TRANSIT: 'In Transit',
      SHIPPED: 'Shipped',
      COMPLETED: 'Completed',
    };

    this.summaryData = [];

    statuses.forEach((status) => {
      console.log(`Fetching count for status: ${status}`);
      this.shipmentService.getShipmentCountByStatus(status).subscribe(
        (response) => {
          console.log(`Response for status "${status}":`, response);

          this.summaryData.push({
            title: statusTitles[status],
            count: response.count,
            image: statusImages[status],
          });

          console.log(`Updated summaryData for "${status}":`, this.summaryData);
        },
        (error: HttpErrorResponse) => {
          console.error(`Error fetching count for status "${status}":`, error);
        }
      );
    });
  }

  onViewEye(row: Shipment): void {
    this.dialog.open(ShipmentDetailsModalComponent, {
      width: '500px',
      data: { shipment: row }, 
    });
  }

  onView(row: any) {
    console.log('View action', row);
  }

  onEdit(row: any) {
    console.log('Edit action', row);
  }
}
