import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { ContractStatusEnum } from "src/enums/contract-status.enum";
import { ContractsService } from "src/services/contract.service";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { LanguageContractEnum } from "src/enums/language-contract.enum";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-details-contract",
  templateUrl: "./details-contract.component.html",
  styleUrls: ["./details-contract.component.scss"],
})
export class DetailsContractComponent {
  loteList: any = {};

  contractId: string;

  constructor(
    private toastrService: ToastrService,
    private router: Router,
    private contractsService: ContractsService,
    private route: ActivatedRoute,
    private ngxSpinnerService: NgxSpinnerService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.route.params.subscribe(params => {
      const id = params["_id"];
      this.contractId = id;
      this.contractsService.getContractById(id).subscribe({
        next: data => {
          this.loteList = data;
          this.ngxSpinnerService.hide();
        },
        error: error => {
          console.error(error);
        },
      });
    });
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

  async downloadPdf() {
    this.ngxSpinnerService.show();
    const selectedLanguage = this.translateService.currentLang;
    let language = "";
    switch (selectedLanguage) {
      case "pt":
        language = LanguageContractEnum.portuguese;
        break;
      case "en":
        language = LanguageContractEnum.english;
        break;
      case "es":
        language = LanguageContractEnum.spanish;
        break;
      case "fr":
        language = LanguageContractEnum.french;
        break;
      default:
        language = LanguageContractEnum.english;
        break;
    }

    this.contractsService
      .getPdf(this.contractId, language, this.loteList.bid_number.classification)
      .then(data => {
        const buffer = data;
        const file = new Blob([buffer], {
          type: "application/pdf",
        });
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = fileURL;
        const name =
          this.loteList.bid_number.bid_count + "/" + new Date(this.loteList.bid_number.createdAt).getFullYear();
        link.setAttribute("download", `Contract-${name}.pdf`);
        link.style.display = "none"; // Oculta o link no DOM
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.ngxSpinnerService.hide();
      })
      .catch(error => {
        console.error(error);
        this.toastrService.error("ERROR DOWNLOAD", "", { progressBar: true });
        this.ngxSpinnerService.hide();
      });
  }

  back(){          
    this.router.navigate(["/pages/licitacoes/contratos-licitacoes"]);
  }

}
