export interface Shipment {
  shipmentId: number;
  orderId: string;
  status: string;
  statusClass: string; // Used for conditional styling
  senderName: string;
  senderAddress: string;
  receiverName: string;
  receiverAddress: string;
  trackingNumber: string;
  shipmentDate: string | Date;
}