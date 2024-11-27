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
  summaryData: any[] = [];

  constructor(private http: HttpClient) {}
  
  getAllShipments() : any{
    return this.http.get(this.apiUrl)
  }

  getShipmentCountByStatus(status: string): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/status/${status}`);
  }
}

