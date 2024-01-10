import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { AssociationService } from 'src/services/association.service';

@Component({
  selector: 'app-association-data',
  templateUrl: './association-data.component.html',
  styleUrls: ['./association-data.component.scss']
})
export class AssociationDataComponent implements OnInit {

  association?: AssociationResponseDto;

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private associationService: AssociationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.activatedRoute.params.subscribe((params) => {
      this.associationService.getById(params['id']).subscribe({
        next: (success) => {
          this.association = success;
          this.ngxSpinnerService.hide();
        },
        error: (error) => {
          console.error(error);
          this.router.navigate(['/pages/associacao']);
          this.ngxSpinnerService.hide();
        }
      });
    });
  }

}
