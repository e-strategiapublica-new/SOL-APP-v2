import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { PdmService } from 'src/services/pdm.service';

@Component({
  selector: 'app-pdm-data',
  templateUrl: './pdm-data.component.html',
  styleUrls: ['./pdm-data.component.scss']
})
export class PdmDataComponent implements OnInit {

  pdm: any;

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private pdmService: PdmService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.activatedRoute.params.subscribe((params) => {
      this.pdmService.getById(params['id']).subscribe({
        next: (data) => {          
          this.pdm = data;
          this.ngxSpinnerService.hide();
        },
        error: (error) => {          
          this.ngxSpinnerService.hide();
          this.router.navigate(['/pages/pdm']);
        }
      });
    });
  }

}
