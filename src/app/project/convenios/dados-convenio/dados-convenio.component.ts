import { Component } from "@angular/core";
import { DatamockService } from "src/services/datamock.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ItemGroupService } from "src/services/item-group.service";
import { LocalStorageService } from "src/services/local-storage.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { ItemsItemGroupResponseDto } from "src/dtos/item-group/item-of-group/item-itemgroup-response.dto";
import { ItemGroupRegisterResponseDto } from "src/dtos/item-group/item-group-register-response.dto";
import { ConvenioResponseDto, WorkPlanInterface } from "src/dtos/convenio/convenio-response.dto";
import { WorkPlanService } from "src/services/work-plan.service";
import { AgreementStatusEnum } from "src/enums/agreement-status.enum";
import { ConvenioService } from "src/services/convenio.service";
import { AuthService } from "src/services/auth.service";

@Component({
  selector: "app-dados-convenio",
  templateUrl: "./dados-convenio.component.html",
  styleUrls: ["./dados-convenio.component.scss"],
})
export class DadosConvenioComponent {
  convenio: ConvenioResponseDto;
  countItemList: number;
  countItens: any;
  user: any

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    public localStorage: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private convenioService: ConvenioService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.convenio = this.route.snapshot.data["agreement"];
  }

  deleteGroup(item: WorkPlanInterface) {
    this.convenioService.removeWorkPlan(this.convenio._id, { workPlanId: item._id }).subscribe({
      next: success => {
        this.convenio.workPlan = this.convenio.workPlan.filter(x => x._id !== item._id);
        this.toastrService.success("Exluido com sucesso!", "", { progressBar: true });
      },
      error: error => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], "", { progressBar: true });
      },
    });
  }

  addGroup() {
    this.router.navigate(["/pages/item-group/new-group"]);
    localStorage.setItem("convenioId", this.convenio._id);
  }

  detailGroup(item: WorkPlanInterface) {
    localStorage.setItem("id-item-group", item._id);
    this.router.navigate(["/pages/item-group"]);
  }

  editPlano(item: WorkPlanInterface) {
    this.router.navigate(["/pages/item-group/edit-group/" + item._id]);
  }

  handleAgreementStatus(item: AgreementStatusEnum) {
    switch (item) {
      case AgreementStatusEnum.canceled:
        return "Cancelado";
      case AgreementStatusEnum.concluded:
        return "Concluido";
      case AgreementStatusEnum.inExecution:
        return "Em execução";
      default:
        return "";
    }
  }
}
