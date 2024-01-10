import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataset, ChartOptions } from 'chart.js';
import { ReportsService } from 'src/services/reports.service';
import { ReportContractResponseDto } from 'src/dtos/reports/report-contract.response.dto';

@Component({
  selector: 'app-report-contract',
  templateUrl: './report-contract.component.html',
  styleUrls: ['./report-contract.component.scss']
})
export class ReportContractComponent {
  response: ReportContractResponseDto | undefined;

  constructor(
    private reportService: ReportsService
  ) { }

  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartData: ChartDataset[] = [
    {
      data: [],
      label: 'Bens',
    },
    {
      data: [],
      label: 'Serviços',
    },
    {
      data: [],
      label: 'Obras',
    },
  ];

  public barChartLabels: string[] = [''];

  public chartReady: boolean = false;

  ngOnInit(): void {
    this.reportService.getData().subscribe({
      next: data => {
        this.response = data;

        this.barChartData[0].data = [data.assetsChart];
        this.barChartData[1].data = [data.servicesChart];
        this.barChartData[2].data = [data.constructionChart];
        this.barChartData[0].label = 'Bens'
        this.barChartData[1].label = 'Serviços'
        this.barChartData[2].label = 'Obras'

        this.chartReady = true;
      }
    })
  }

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }

  // public randomize(): void {
  //   // Only Change 3 values
  //   this.barChartData.datasets[0].data = [
  //     Math.round(Math.random() * 100),
  //     59,
  //     80,
  //     Math.round(Math.random() * 100),
  //     56,
  //     Math.round(Math.random() * 100),
  //     40];

  //   this.chart?.update();
  // }
}
