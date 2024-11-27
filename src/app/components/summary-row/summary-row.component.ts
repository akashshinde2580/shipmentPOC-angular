import { Component, OnInit } from '@angular/core';
import { ShipmentService } from '../shipment.service';
import { Shipment } from './shipment.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-summary-row',
  templateUrl: './summary-row.component.html',
  styleUrls: ['./summary-row.component.scss']
})
export class SummaryRowComponent  {

  // summaryData = [
  //   {
  //     title: 'In Transit',
  //     count: 120,
  //     image: 'assets/transit.png',
  //     percentage: 5, 
  //   },
  //   {
  //     title: 'Shipped',
  //     count: 250,
  //     image: 'assets/shipped.png',
  //     percentage: 8, 
  //   },
  //   {
  //     title: 'Delivered',
  //     count: 150,
  //     image: 'assets/delivered.png',
  //     percentage: 12, 
  //   }
  // ];

  summaryData: any[] = [];

  // shipmentData: ShipmentResponse = { status: '', shipments: [] };  // Initialize with empty data
  displayedColumns: string[] = [
    'shipmentId', 'orderId', 'status', 'senderName', 'receiverName', 'trackingNumber', 'shipmentDate', 'action'
  ];
  shipmentData: Shipment[] = [];

  constructor(private shipmentService: ShipmentService){}

  ngOnInit(): void {
    console.log("I am here")
    console.log(this.summaryData)
    this.fetchShipments();
    this.fetchShipmentStatusCounts();
  }
  
  fetchShipments(): void {
    console.log("In fetchShipments");

    this.shipmentData =  this.shipmentService.getAllShipments();
    // this.shipmentService.getAllShipments().subscribe(
    //   (data: ShipmentResponse) => {
    //     console.log('Fetched shipments:', data);  // Check if data is returned
    //     this.shipmentData = data;  // Assign the fetched data to the object
    //   },
    //   (error) => {
    //     console.error('Error fetching shipment data', error);
    //   }
    // );
    
    this.shipmentService.getAllShipments().subscribe((data : Shipment[]) => {
      console.log(data);
      this.shipmentData = data; 
      console.log(this.shipmentData)
      return this.shipmentData
    },
    (error : HttpErrorResponse) => {
      console.error('Error fetching shipment data', error);
    });
  }

  fetchShipmentStatusCounts(): void {
    const statuses: Array<'Delivered' | 'In Transit' | 'Cancelled'> = ['Delivered', 'In Transit', 'Cancelled'];
  
    const statusImages: { [key in 'Delivered' | 'In Transit' | 'Cancelled']: string } = {
      Delivered: 'assets/delivered.png',
      'In Transit': 'assets/transit.png',
      Cancelled: 'assets/shipped.png',
    };
  
    const statusTitles: { [key in 'Delivered' | 'In Transit' | 'Cancelled']: string } = {
      Delivered: 'Delivered Shipments',
      'In Transit': 'In Transit Shipments',
      Cancelled: 'Cancelled Shipments',
    };
  
    this.summaryData = [];
  
    statuses.forEach((status) => {
      console.log(`Fetching count for status: ${status}`);
      this.shipmentService.getShipmentCountByStatus(status).subscribe(
        (response) => {
          console.log(`Response for ${status}:`, response);
  
          this.summaryData.push({
            title: statusTitles[status],
            count: response.count,
            image: statusImages[status],
          });
  
          console.log(`Updated summaryData:`, this.summaryData);
        },
        (error: HttpErrorResponse) => {
          console.error(`Error fetching count for status ${status}`, error);
        }
      );
    });
  }
  
  
  onView(row: any) {
    console.log('View action', row);
  }

  onEdit(row: any) {
    console.log('Edit action', row);
  }
}