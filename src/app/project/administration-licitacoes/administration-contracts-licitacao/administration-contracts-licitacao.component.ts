import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DatamockService } from "src/services/datamock.service";
import { Location } from "@angular/common";
import { ContractsService } from "src/services/contract.service";
import { ContractStatusEnum } from "src/enums/contract-status.enum";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-administration-contracts-licitacao",
  templateUrl: "./administration-contracts-licitacao.component.html",
  styleUrls: ["./administration-contracts-licitacao.component.scss"],
})
export class AdministrationContractsLicitacaoComponent {
  contract: any[] = [];
  id_licitacoes_detail: string

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private contractsService: ContractsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.contractsService.getContractByBidId(localStorage.getItem("bidId") || "").subscribe({
      next: response => {
        this.contract = response;
        this.ngxSpinnerService.hide();
      },
      error: error => {
        console.error(error);
        this.ngxSpinnerService.hide();
        // this.location.back();
      }
    });
    /*
    this.route.data.subscribe({
      next: data => {
        console.log( data )
      },
    });
    */

  }

  goBackDetail(_id: string) {
    this.router.navigate(["licitacoes/contratos-licitacoes/" + _id]);
  }

  handlerStatus(status: string) {
    switch (status) {
      case ContractStatusEnum.aguardando_assinaturas:
        return "Aguardando assinaturas";
      case ContractStatusEnum.aguardando_fornecedor:
        return "Aguardando fornecedor";
      case ContractStatusEnum.assinado:
        return "Assinado";
      case ContractStatusEnum.concluido:
        return "Concluído";
      case ContractStatusEnum.executado_parcialmente:
        return "Executado parcialmente";
      case ContractStatusEnum.inexecucao_total:
        return "Inexecução total";
      default:
        return "-";
    }
  }

  back(){          
    this.router.navigate([`pages/licitacoes/detalhes-licitacoes/${localStorage.getItem("bidId")}`]);
  }

}
