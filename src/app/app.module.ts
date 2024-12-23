import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SummaryRowComponent } from './components/summary-row/summary-row.component';
import { HttpClientModule } from '@angular/common/http';
import { ShipmentService } from './components/shipment.service';
import { ShipmentDetailsModalComponent } from './components/shipment-details-modal/shipment-details-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    SummaryRowComponent,
    ShipmentDetailsModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatTableModule,
    HttpClientModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    BrowserAnimationsModule,
  ],
  providers: [ShipmentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
