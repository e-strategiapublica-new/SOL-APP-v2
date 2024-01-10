import { Component } from '@angular/core';
import { ReportsService } from 'src/services/reports.service';

@Component({
  selector: 'app-report-general',
  templateUrl: './report-general.component.html',
  styleUrls: ['./report-general.component.scss']
})
export class ReportGeneralComponent {

  constructor(
    private reportService: ReportsService
  ) { }

  submit(value: string) {
    this.reportService.downloadExcel(value)
  }

}
