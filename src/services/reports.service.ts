import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ReportContractResponseDto } from "src/dtos/reports/report-contract.response.dto";
import { Observable, map, catchError } from 'rxjs';
import * as XLSX from 'xlsx'
import { saveAs } from "file-saver";

@Injectable()
export class ReportsService extends BaseService {

  private url = `${environment.api.path}/report`;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  getData() {
    return this.httpClient
      .get<ReportContractResponseDto>(`${this.url}`, this.authorizedHeader);
  }

  getReportGenerated() {
    return this.httpClient
      .get(`${this.url}/report-generated`, this.authorizedHeader);
  }

  public downloadExcel(type: string): void {
    const downloadUrl = 'download-data/' + type;

    const userJson = localStorage.getItem('user') as string;
    const user = JSON.parse(userJson);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${user?.token}`,
    });

    this.httpClient
      .get(`${this.url}/${downloadUrl}`, {
        headers: headers,
        responseType: 'blob', 
      })
      .subscribe((response) => {        
        this.convertExcelToCSV(response);
      });
  }

  private saveExcelFile(blob: Blob): void {
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = 'report.xlsx';

    downloadLink.click();

    window.URL.revokeObjectURL(downloadLink.href);
  }
  convertExcelToCSV(blob: Blob) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
  
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Ignora a primeira linha
  
      const csvData = this.convertJSONToCSV(jsonData);

      const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
  
      saveAs(csvBlob, 'report.csv');
    };
    reader.readAsArrayBuffer(blob);
  }
  
  convertJSONToCSV(jsonData: any[]) {
    const separator = ',';
    const csvRows = jsonData.map((row) =>
      row.map((cell: any) => (cell || '').toString()).join(separator)
    );
    return csvRows.join('\n');
  }

  download(_id: string) {
    return this.httpClient
      .get(`${this.url}/download-report/${_id}`, this.authorizedHeaderFile)
      .pipe(map(response => response), catchError(this.serviceError))
  }

}