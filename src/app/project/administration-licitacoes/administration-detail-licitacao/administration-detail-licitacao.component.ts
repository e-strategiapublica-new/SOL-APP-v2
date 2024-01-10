import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DatamockService } from "src/services/datamock.service";
import { FracassarLicitacaoComponent } from "./fracassar-licitacao/fracassar-licitacao.component";
import { RecusarLicitacaoComponent } from "./recusar-licitacao/recusar-licitacao.component";
import { CancelarLicitacaoComponent } from "./cancelar-licitacao/cancelar-licitacao.component";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { AssociationBidService } from "src/services/association-bid.service";
import { BidTypeEnum } from "src/enums/bid-type.enum";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { LanguageContractEnum } from "src/enums/language-contract.enum";
import { ModelContractClassificationEnum } from "src/enums/modelContract-classification.enum";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "src/services/auth.service";

@Component({
  selector: "app-administration-detail-licitacao",
  templateUrl: "./administration-detail-licitacao.component.html",
  styleUrls: ["./administration-detail-licitacao.component.scss"],
})
export class AdministrationDetailLicitacaoComponent {
  oneStep = true;
  twoStep = false;
  threeStep = false;
  fourStep = false;
  fiveStep = false;
  sixStep = false;
  sevenStep = false;

  response: any;

  prazoEmdias: number;
  showDate = false;

  storedLanguage: string | null;

  id_licitacoes_detail: string;

  constructor(
    public authService: AuthService,
    private modalService: NgbModal,
    private router: Router,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    private bidService: AssociationBidService,
    private translate: TranslateService
  ) { }
  ngOnInit(): void {
    this.storedLanguage = localStorage.getItem("selectedLanguage");
    this.spinnerService.show();    
    
    this.route.data.subscribe({
      next: data => {
        this.response = data["bid"];              
        this.spinnerService.hide();
      },
    });
    

    this.prazoEmdias = this.calcularPrazoEmDias(this.response.start_at, this.response.end_at);    

  }

  detailBids(i: any) { }

  calcularPrazoEmDias(prazoInicial: any, prazoFinal: any) {
    const dataInicial = new Date(prazoInicial);
    const dataFinal = new Date(prazoFinal);

    const diferencaEmMilissegundos = dataFinal.getTime() - dataInicial.getTime();

    const umDiaEmMilissegundos = 24 * 60 * 60 * 1000;
    const diferencaEmDias = Math.floor(diferencaEmMilissegundos / umDiaEmMilissegundos);

    return diferencaEmDias;
  }

  async openModal(command: string, item: any = this.response) {

    if (this.response !== null) {
      localStorage.setItem("bidId", this.response._id);
    }
    if (command === "onefailbids")
      this.modalService.open(FracassarLicitacaoComponent, { centered: true, backdrop: "static", keyboard: false });
    if (command === "recusa")
      this.modalService.open(RecusarLicitacaoComponent, { centered: true, backdrop: "static", keyboard: false });
    if (command === "cancel")
      this.modalService.open(CancelarLicitacaoComponent, { centered: true, backdrop: "static", keyboard: false });
    if (command === "lote") {
      localStorage.setItem("lotes", JSON.stringify(this.response));
      this.router.navigate(["/pages/licitacoes/lote-licitacoes"]);
    }
    if (command === "proposal") {
      localStorage.setItem("bidResponse", JSON.stringify(item));
      this.router.navigate(["/pages/proposal-screening/proposal-accepted"]);
    }
    if (command === "contract") this.router.navigate(["/pages/licitacoes/contratos-licitacoes"]);

    if (command === "edital") {
      this.spinnerService.show();
      let type = ModelContractClassificationEnum.editalBens;
      switch (this.response.classification) {
        case "servicos":
          type = ModelContractClassificationEnum.editalServicos;
          break;
        case "obras":
          type = ModelContractClassificationEnum.editalObras;
          break;
        case "bens":
          type = ModelContractClassificationEnum.editalBens;
          break;
        default:
          break;
      }

      const selectedLanguage = this.translate.currentLang;
      let language;
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

      await this.bidService
        .downloadDocument(this.response._id, language, type)
        .then(data => {
          const buffer = data;
          const file = new Blob([buffer], {
            type: "application/pdf",
          });
          const fileURL = URL.createObjectURL(file);
          const link = document.createElement("a");
          link.href = fileURL;
          const name = this.response.bid_count + "/" + new Date(this.response.createdAt).getFullYear();
          link.setAttribute("download", `Edital-${name}.pdf`);
          link.style.display = "none"; // Oculta o link no DOM
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.spinnerService.hide();
        })
        .catch(error => {
          let errorMessage = "Erro ao tentar efetuar o Download";

          switch (this.storedLanguage) {
            case "pt":
              errorMessage = "Erro ao tentar efetuar o Download";
              break;
            case "en":
              errorMessage = "Error while trying to download";
              break;
            case "fr":
              errorMessage = "Erreur lors de la tentative de téléchargement";
              break;
            case "es":
              errorMessage = "Error al intentar descargar";
              break;
          }

          this.toastrService.error(errorMessage, "", { progressBar: true });
          this.spinnerService.hide();
        });
    }

    if (command === "dados_complementares") {
      const result = await this.bidService.download(this.response._id, "ataFile").toPromise();

      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result;

        if (typeof result === "string") {
          const array = JSON.parse(result);

          for (let dados of array) {
            const pdfData = new Uint8Array(dados.result.data);
            const file = new Blob([pdfData], { type: "application/pdf" });

            const fileURL = URL.createObjectURL(file);

            const downloadLink = document.createElement("a");
            downloadLink.href = fileURL;
            downloadLink.download = "arquivoComplementar.pdf";

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
        } else {
          console.error("Error ao ler o pdf..");
        }
      };

      reader.onerror = (event: ProgressEvent<FileReader>) => {
        console.error("Error ao ler o pdf.");
      };

      reader.readAsText(result);

      //window.open(fileURL);
      //this.toastrService.success("Baixado com sucesso!", "", { progressBar: true });
    }
    if (command === "ata") {
      this.spinnerService.show();
      const selectedLanguage = this.translate.currentLang;
      let language;
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

      await this.bidService
        .downloadDocument(this.response._id, language, ModelContractClassificationEnum.ata)
        .then(data => {
          const buffer = data;
          const file = new Blob([buffer], {
            type: "application/pdf",
          });
          const fileURL = URL.createObjectURL(file);
          const link = document.createElement("a");
          link.href = fileURL;
          const name = this.response.bid_count + "/" + new Date(this.response.createdAt).getFullYear();
          link.setAttribute("download", `Ata-${name}.pdf`);
          link.style.display = "none"; // Oculta o link no DOM
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.spinnerService.hide();
        })
        .catch(error => {
          let errorMessage = "Erro ao tentar efetuar o Download";

          switch (this.storedLanguage) {
            case "pt":
              errorMessage = "Erro ao tentar efetuar o Download";
              break;
            case "en":
              errorMessage = "Error while trying to download";
              break;
            case "fr":
              errorMessage = "Erreur lors de la tentative de téléchargement";
              break;
            case "es":
              errorMessage = "Error al intentar descargar";
              break;
          }

          this.toastrService.error(errorMessage, "", { progressBar: true });
          this.spinnerService.hide();
        });
    }
  }

  releasedBid() {
    let request = {
      status: "released",
    };

    this.spinnerService.show();

    this.bidService.changeStatus(this.response._id, request).subscribe({      
      next: data => {
                
        const toastr = this.toastrService.success(this.translate.instant('TOASTRS.BID_APPOVED'), "", { progressBar: true });
        this.response.status = "released";
        if (toastr) {
          toastr.onHidden.subscribe(() => {
            this.modalService.dismissAll();
          });
        }
        this.spinnerService.hide();
      },
      error: error => {
        this.toastrService.error(this.translate.instant('TOASTRS.ERROR_BID_APPROVED'), "", { progressBar: true });
      },
    });

    /*
    this.showDate = true;
    setTimeout(() => {
      location.reload();
    }, 150)    
    */
    
  }

  handlerBidType(type: string) {
    if (type === BidTypeEnum.individualPrice) return "Preço Individual";
    if (type === BidTypeEnum.allotmentPrice) return "Preço Lote";
    if (type === BidTypeEnum.globalPrice) return "Preço Global";
    return "-";
  }

  back(){      
    localStorage.setItem('id_licitaciones','0');
    this.router.navigate(['/pages/licitacoes']);
  }

}
