import { Component } from '@angular/core';
import { ReportsService } from 'src/services/reports.service';
import { saveAs } from 'file-saver';
import { Buffer } from 'buffer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FilterFuzzy from 'src/utils/filterFuzzy.util';
import * as XLSX from 'xlsx';
import Fuse from 'fuse.js';
import { ReportGeneratedGetResponseDto } from 'src/dtos/reports/report-generated-get-response.dto';

@Component({
  selector: 'app-report-generated',
  templateUrl: './report-generated.component.html',
  styleUrls: ['./report-generated.component.scss']
})
export class ReportGeneratedComponent {

  response: ReportGeneratedGetResponseDto[] = []
  responseFilter: ReportGeneratedGetResponseDto[] = []

  currentPage = 1;
  itemsPerPage = 5;

  language : any;
  form: FormGroup;

  constructor(
    private reportService: ReportsService,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(3)]],
    });
   }

  ngOnInit(): void {
    this.list()
    this.form.controls['search'].valueChanges.subscribe((text: string) => {
      // if (text.length > 1)
      //   this.response = this.response.filter((item: any) =>
      //     item.situation.toLowerCase().includes(text) ||
      //     item.name.toLowerCase().includes(text) 
      //   );
      // else
      //   this.list();
      if (text){
        // this.convenioFilter = this.convenioList.filter((item: any) =>
        //   item.register_object.toLowerCase().includes(text) ||
        //   item.register_number.toLowerCase().includes(text) ||
        //   item.association.name.toLowerCase().includes(text)
        // );

        // const array = []
        // for (let item of this.response){
          
        //   array.push({termo: item.name.toLowerCase(), id: item._id})
  
          
        // }
        // const results = FilterFuzzy.fuzzySearch(text, array);
        // this.responseFilter = this.response.filter((item: any) => results.find((element) => element.item.id === item._id && element.distancia === 0))

        // if(this.responseFilter.length) return;

        // this.responseFilter = []
        // for (let item of results){
        //   this.responseFilter.push(this.response.find((element: any) => element._id === item.item.id))
        // }       
          
        const name = this.response.filter(obj => ((obj.name).toLowerCase()).includes(text.toLowerCase()));        
        const result = [...name]
        

        this.responseFilter = result
      }
      else
        this.responseFilter = this.response
    });
    this.language = localStorage.getItem('selectedLanguage');
  }

  list(){
    this.reportService.getReportGenerated().subscribe({
      next: data => {
        this.response = <ReportGeneratedGetResponseDto[]>data
        this.response = this.response.sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        // this.response.forEach((e: any, i: number) => {
        //   this.response[i].formatData = e.createdAt.
        // })

        this.responseFilter = <ReportGeneratedGetResponseDto[]>data
      }
    })
  }

  donwload(item: any) {

    const archivePath = item.archive;
    const startIndex = archivePath.lastIndexOf("/") + 1;
    const endIndex = archivePath.indexOf(".xlsx");
    const reportName = archivePath.substring(startIndex, endIndex);

    this.reportService.download(item._id).subscribe({
      next: (data: any) => {
        // -----xlsx ----
        // const arrayBuffer = Buffer.from(data.data);
        // const blob = new Blob([arrayBuffer], { type: data.type });

        // const fileName = reportName;

        // saveAs(blob, fileName + '.xlsx');
        // --------csv ----
        const arrayBuffer = Buffer.from(data.data);
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
       // console.log(worksheet)
        const csvData = XLSX.utils.sheet_to_csv(worksheet)
        // console.log('csvData',csvData)
        const blob = new Blob([csvData], { type: 'text/csv' });
        const fileName = reportName
        saveAs(blob, fileName + '.csv')
      }
    })

  }

}
