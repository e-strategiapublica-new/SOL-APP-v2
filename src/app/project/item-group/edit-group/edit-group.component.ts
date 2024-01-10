import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CostItemsResponseDto } from 'src/dtos/cost-items/cost-items-response.dto';
import { CostItemsService } from 'src/services/cost-items.service';
import { Location } from '@angular/common';
import { LocalStorageService } from 'src/services/local-storage.service';
import { WorkPlanRegisterRequest } from 'src/dtos/workPlan/work-plan-register-request.dto';
import { WorkPlanService } from 'src/services/work-plan.service';
import { WorkPlanInterface } from 'src/dtos/convenio/convenio-response.dto';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {
  costItemsList: CostItemsResponseDto[];
  form: FormGroup;
  isSubmit: boolean = false;
  response: WorkPlanInterface;
  request: WorkPlanRegisterRequest;
  itemList: ItemCustom[] = [];

  constructor(
    private costItemsService: CostItemsService,
    private workPlanService: WorkPlanService,
    public localStorage: LocalStorageService,
    private formBuilder: FormBuilder,
    private location: Location,
    private translate: TranslateService,

    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      items: ['', [Validators.required]],
      price: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getCostItems();
    this.response = this.route.snapshot.data['workPlan'];

    this.form.patchValue({
     name: this.response.name,
    });
    this.itemList = this.response.product
  }


  getCostItems() {
    this.costItemsService.list().subscribe({
      next: (success) => {
        this.costItemsList = success;
      },
      error: (error) => {
        console.error(error)
      }
    });
  }


  addItemList() {
    if (this.form.invalid) {
      return;
    }
    const name = this.form.controls["name"].value;

    const costItems = this.costItemsList.find(item => item._id === this.form.controls["items"].value);

    if (!costItems) {
      this.toastrService.error(this.translate.instant('TOASTRS.FIND_ITEM'), '', { progressBar: true });
      return;
    }
    const item: ItemCustom = {
      costItems: costItems,
      quantity: this.form.controls["quantity"].value,
      unitValue: this.form.controls["price"].value,
    };
    this.itemList.push(item);

    this.form.reset();
    this.form.controls["name"].setValue(name);
  }

  removeItem(item: ItemCustom) {
    const listArray = this.itemList.indexOf(item);
    if (listArray !== -1) this.itemList.splice(listArray, 1);
  }

  OnSubmit() {
    this.request = {
      name: this.form.controls['name'].value,
      product: this.itemList.map(item => {
        return { quantity: item.quantity, unitValue: item.unitValue, costItems: item.costItems._id as string };
      }),
    }

    this.workPlanService.update(this.response._id, this.request).subscribe({
      next: (success) => {
        this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_EDIT_GROUP'), '', { progressBar: true });
        this.location.back();
      },
      error: (error) => {
        console.error(error);
        this.toastrService.success(error.error.errors[0], this.translate.instant('TOASTRS.ERROR_EDIT_GROUP'), { progressBar: true });
      }
    });
  }

  goBack() {
    this.location.back();
  }
}

interface ItemCustom {
  quantity: number;
  unitValue: number;
  costItems: CostItemsResponseDto;
}
