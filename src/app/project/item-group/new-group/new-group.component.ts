import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CostItemsResponseDto } from "src/dtos/cost-items/cost-items-response.dto";
import { ItemsItemGroupRequestDto } from "src/dtos/item-group/item-of-group/item-itemgroup-request.dto";
import { CostItemsService } from "src/services/cost-items.service";
import { ItemsService } from "src/services/items.service";
import { Location } from "@angular/common";
import { LocalStorageService } from "src/services/local-storage.service";
import { WorkPlanService } from "src/services/work-plan.service";
import { WorkPlanProductInterface, WorkPlanRegisterRequest } from "src/dtos/workPlan/work-plan-register-request.dto";
import { ConvenioService } from "src/services/convenio.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-new-group",
  templateUrl: "./new-group.component.html",
  styleUrls: ["./new-group.component.scss"],
})
export class NewGroupComponent implements OnInit, OnDestroy {
  costItemsList: any[];
  form: FormGroup;
  isSubmit: boolean = false;
  request: WorkPlanRegisterRequest;
  itemList: any[] = [];
  convenioId: string;
      
  selectedItem: string = "1";
  selectedUnit: string = "1";
  unitList: any[] = [];

  constructor(
    private costItemsService: CostItemsService,
    private itemsService: ItemsService,
    private workPlanService: WorkPlanService,
    private formBuilder: FormBuilder,
    private location: Location,
    private translate: TranslateService,
    private toastrService: ToastrService,
    private convenioService: ConvenioService
  ) {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(50)]],
      items: ["", [Validators.required]],
      unit: ["", [Validators.required]],
      price: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.convenioId = localStorage.getItem("convenioId") || "";
    
    this.getCostItems();

    
    this.form.controls['items'].valueChanges.subscribe((_id: string) => { 
        this.selectedItem = this.form.controls['items'].value;        
        if(this.selectedItem != "1"){         
          for (let i=0;i<this.costItemsList.length;i++){        
            if(_id == this.costItemsList[i]._id){
              this.unitList = this.costItemsList[i].pdm.unitList
            }
          }
        }
    })
    

  }

  ngOnDestroy(): void {   
    localStorage.removeItem("convenioId");
  }

  getCostItems() {
    this.itemsService.getItems().subscribe({
      next: data => {
        this.costItemsList = data;
      },
      error: error => {
        console.error(error);
      },
    });
  }

  addItem(): void {
    if (this.form.invalid) {
      return;
    }
    const name = this.form.controls["name"].value;

    const costItems = this.costItemsList.find(item => item._id === this.form.controls["items"].value);

    if (!costItems) {
      this.toastrService.error(this.translate.instant('TOASTRS.FIND_ITEM'), '', { progressBar: true });
      return;
    }
    const item = {
      costItems: costItems,
      quantity: this.form.controls["quantity"].value,
      unit: this.form.controls["unit"].value,
      unitValue: this.form.controls["price"].value,
    };
    this.itemList.push(item);
    
    this.form.controls["name"].setValue(name);
    this.selectedItem = "1";
    this.selectedUnit = "1";
    this.form.controls["quantity"].setValue("");
    this.form.controls["price"].setValue("");
        
  }

  removeItem(item: ItemCustom) {
    const listArray = this.itemList.indexOf(item);
    if (listArray !== -1) this.itemList.splice(listArray, 1);
  }

  onSubmit() {
    this.isSubmit = true;

    if (this.form.controls["name"].invalid || !this.itemList.length) {
      return;
    }   

    console.log(this.itemList)

    this.request = {
      name: this.form.controls["name"].value,
      product: this.itemList.map(item => {
        return { 
          quantity: item.quantity,
          unit: item.unit, 
          unitValue: item.unitValue, 
          costItems: item.costItems._id as string 
        };
      }),
    };

    this.workPlanService.create(this.request).subscribe({
      
      next: success => {
        this.convenioService.addWorkPlan(this.convenioId, { workPlanId: success._id }).subscribe({
          next: success => {
            this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_CREATE_GROUP'), '', { progressBar: true });
            this.location.back();
          },
          error: error => {            
            this.toastrService.error(error.error.errors[0],this.translate.instant('TOASTRS.ERROR_CREATE_GROUP'), { progressBar: true });
          },
        });
      },
      error: error => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], this.translate.instant('TOASTRS.ERROR_CREATE_GROUP'), { progressBar: true });
      },
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
