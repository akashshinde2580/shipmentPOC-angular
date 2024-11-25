import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shipment } from './summary-row/shipment.interface';


@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  private apiUrl = 'http://localhost:8083/api/shipments'; 
  shipmentData: Shipment[] = [];

  constructor(private http: HttpClient) {}

  // getAllShipments() : Shipment[]{
  //   this.http.get(this.apiUrl).subscribe((data) => {
  //     console.log(data);
  //     this.shipmentData = data; 
  //     console.log(this.shipmentData)
  //     return this.shipmentData
  //   },
  //   (error) => {
  //     console.error('Error fetching shipment data', error);
  //   });
  // }
  getAllShipments() : any{
    return this.http.get(this.apiUrl)
  }
}

