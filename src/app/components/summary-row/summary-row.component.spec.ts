import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryRowComponent } from './summary-row.component';

describe('SummaryRowComponent', () => {
  let component: SummaryRowComponent;
  let fixture: ComponentFixture<SummaryRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryRowComponent]
    });
    fixture = TestBed.createComponent(SummaryRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
