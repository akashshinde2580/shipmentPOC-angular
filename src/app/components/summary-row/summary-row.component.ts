import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ShipmentService } from '../shipment.service';
import { Shipment } from './shipment.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ShipmentDetailsModalComponent } from '../shipment-details-modal/shipment-details-modal.component';
import { Chart, registerables } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
Chart.register(...registerables);

@Component({
  selector: 'app-summary-row',
  templateUrl: './summary-row.component.html',
  styleUrls: ['./summary-row.component.scss'],
})
export class SummaryRowComponent implements OnInit, AfterViewInit {
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

  summaryData: {
    title: string;
    count: number;
    image: string;
    status: 'IN_TRANSIT' | 'SHIPPED' | 'COMPLETED';
  }[] = [];
  shipmentData: Shipment[] = [];

  shipmentDataSource = new MatTableDataSource<Shipment>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  shipmentCountsByDate: { date: string; count: number }[] = [];

  row: any;

  statusColors: {
    [key in 'IN_TRANSIT' | 'SHIPPED' | 'COMPLETED']: {
      background: string;
      border: string;
    };
  } = {
    IN_TRANSIT: { background: '#ff9800', border: 'grey' },
    SHIPPED: { background: '#2196f3', border: 'grey' },
    COMPLETED: { background: '#4caf50', border: 'grey' },
  };

  constructor(
    private shipmentService: ShipmentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchShipments();
    this.fetchShipmentStatusCounts();
  }

  ngAfterViewInit(): void {
    this.renderBarChart();
    this.renderTrendlineChart();
    this.shipmentDataSource.paginator = this.paginator;
    this.shipmentDataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.shipmentDataSource.filter = filterValue.trim().toLowerCase();
  }

  //Method to Fetch Shipments and Paginator
  fetchShipments(): void {
    this.shipmentData = this.shipmentService.getAllShipments();
    this.shipmentService.getAllShipments().subscribe(
      (data: Shipment[]) => {
        this.shipmentData = data;
        this.shipmentDataSource.data = this.shipmentData;
        this.shipmentDataSource.paginator = this.paginator;

        this.groupShipmentsByDate();
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching shipment data', error);
      }
    );
  }

  // Method to Fetch the Status Counts
  fetchShipmentStatusCounts(): void {
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
      this.shipmentService.getShipmentCountByStatus(status).subscribe(
        (response) => {
          this.summaryData.push({
            title: statusTitles[status],
            count: Math.round(response.count),
            image: statusImages[status],
            status: status,
          });
          this.renderBarChart();
        },
        (error) => {
          console.error(`Error fetching count for status "${status}":`, error);
        }
      );
    });
  }

  // Change status badge colors
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

  //Bar chart
  renderBarChart(): void {
    if (this.summaryData.length === 0) {
      console.warn('No data available for rendering the bar chart.');
      return;
    }

    const labels = this.summaryData.map((item) => item.title);
    const counts = this.summaryData.map((item) => item.count);
    const backgroundColors = this.summaryData.map(
      (item) => this.statusColors[item.status].background
    );
    const borderColors = this.summaryData.map(
      (item) => this.statusColors[item.status].border
    );
    const totalCount = counts.reduce((acc, count) => acc + count, 0);
    const yAxisMax = totalCount * 2.0;

    const totalCountPlugin = {
      id: 'totalCount',
      beforeDraw: (chart: any) => {
        const ctx = chart.ctx;
        const width = chart.width;
        const top = chart.chartArea.top;

        ctx.save();
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.fillText(`Total Count: ${totalCount}`, width / 2, top - 10);
        ctx.restore();
      },
    };

    const chartElement = document.getElementById(
      'statusBarChart'
    ) as HTMLCanvasElement;
    if (chartElement) {
      Chart.getChart(chartElement)?.destroy();
    }

    new Chart(chartElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Shipment Status Counts',
            data: counts,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 25,
            bottom: -8,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => `Count: ${context.raw}`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Status',
            },
          },
          y: {
            beginAtZero: true,
            max: yAxisMax,
            title: {
              display: true,
              text: 'Count',
            },
            ticks: {
              stepSize: 1,
              callback: (value) => value.toString(),
            },
          },
        },
      },
      plugins: [totalCountPlugin],
    });
  }

  //Group Shipmenmts By Date
  groupShipmentsByDate(): void {
    const shipmentCounts: { [key: string]: number } = {};

    this.shipmentData.forEach((shipment) => {
      const date = new Date(shipment.shipmentDate).toLocaleDateString();
      shipmentCounts[date] = (shipmentCounts[date] || 0) + 1;
    });

    this.shipmentCountsByDate = Object.keys(shipmentCounts).map((date) => ({
      date,
      count: shipmentCounts[date],
    }));

    this.renderTrendlineChart();
  }

  //Trendline chart
  renderTrendlineChart(): void {
    if (this.shipmentCountsByDate.length === 0) {
      console.warn('No data available for rendering the trendline chart.');
      return;
    }

    const dates = this.shipmentCountsByDate.map((item) => item.date);
    const counts = this.shipmentCountsByDate.map((item) => item.count);

    const chartElement = document.getElementById(
      'shipmentTrendlineChart'
    ) as HTMLCanvasElement;
    if (chartElement) {
      Chart.getChart(chartElement)?.destroy();
    }

    new Chart(chartElement, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Shipments Over Time',
            data: counts,
            fill: false,
            borderColor: '#2196f3',
            tension: 0.1,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#2196f3',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
            },
          },
          y: {
            beginAtZero: true,
            max: 6,
            title: {
              display: true,
              text: 'Shipment Count',
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `Count: ${context.raw}`,
            },
          },
        },
      },
    });
  }

  //Eye Icon for Shipment Details
  onViewEye(row: Shipment): void {
    this.dialog.open(ShipmentDetailsModalComponent, {
      width: '600px',
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
