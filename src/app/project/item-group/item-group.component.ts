import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { WorkPlanInterface } from "src/dtos/convenio/convenio-response.dto";
import { LocalStorageService } from "src/services/local-storage.service";
import { WorkPlanService } from "src/services/work-plan.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-item-group",
  templateUrl: "./item-group.component.html",
  styleUrls: ["./item-group.component.scss"],
})
export class ItemGroupComponent {
  itemgroupListt: any;
  response: WorkPlanInterface = {
    name: "",
    _id: "",
    product: [],
  };

  constructor(
    public router: Router,
    private workPlanService: WorkPlanService,
    private localtion: Location,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.ngxSpinnerService.show();
    const id = localStorage.getItem("id-item-group");
    if (!id) {
      this.localtion.back();
      return;
    }
    this.workPlanService.getById(id).subscribe({
      next: success => ((this.response = success), this.ngxSpinnerService.hide()),
      error: error => (console.error(error), this.ngxSpinnerService.hide()),
    });
  }

  dataItem(i: string) {
    localStorage.setItem("editcostitems", JSON.stringify(i));
    this.router.navigate([`pages/itens-custo/dados-item/${i}`]);
  }
}
