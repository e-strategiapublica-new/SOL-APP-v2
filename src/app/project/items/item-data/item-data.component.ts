import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { ItemsService } from 'src/services/items.service';

@Component({
  selector: 'app-item-data',
  templateUrl: './item-data.component.html',
  styleUrls: ['./item-data.component.scss']
})
export class ItemDataComponent implements OnInit {

  item: any;

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private itemsService: ItemsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.activatedRoute.params.subscribe((params) => {
      this.itemsService.getById(params['id']).subscribe({
        next: (data) => {
          this.item = data;
          this.ngxSpinnerService.hide();
        },
        error: (error) => {          
          this.ngxSpinnerService.hide();
          this.router.navigate(['/pages/items']);
        }
      });
    });
  }

}
