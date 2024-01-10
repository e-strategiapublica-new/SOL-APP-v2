import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserListResponseDto } from "src/dtos/user/user-list-response.dto";
import { AllotmentResponseDto } from "src/dtos/allotment/allotment-response.dto";
import { LocalStorageService } from "src/services/local-storage.service";
import { ProposalService } from "src/services/proposal.service";
import { AssociationBidService } from "src/services/association-bid.service";
import { TranslateService } from "@ngx-translate/core";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { LanguageContractEnum } from "src/enums/language-contract.enum";
import { ModelContractClassificationEnum } from "src/enums/modelContract-classification.enum";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-fornecedor-detalhe-licitacao",
  templateUrl: "./fornecedor-detalhe-licitacao.component.html",
  styleUrls: ["./fornecedor-detalhe-licitacao.component.scss"],
})
export class FornecedorDetalheLicitacaoComponent {
  oneStep: number | null = null;
  loteListIndex: any;
  loteList: any[];
  response: any;
  associationName: UserListResponseDto;
  listLote: AllotmentResponseDto[];
  map: Map<number, number> = new Map();
  storedLanguage: string | null;
  proposals: any = [];
  reviwerInfo: any;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    public localStorage: LocalStorageService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private bidService: AssociationBidService,
    private ngxSpinnerService: NgxSpinnerService,
    private proposalService: ProposalService,
  ) {}
  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.response = data["bid"];
        this.reviwerInfo = this.response?.agreement?.reviewer || {};
        this.proposalService.listProposalByBid(this.response._id).subscribe({
          next: data => {
            this.proposals = data;
          },
        });

        this.getVerify();
      },
    });
    this.storedLanguage = localStorage.getItem("selectedLanguage");
  }

  openDetail(value: number) {
    if (!this.map.has(value)) {
      this.map.set(value, value);
    } else {
      this.map.delete(value);
    }
  }

  async openModal(command: string) {
    if (command === "edital") {
      this.ngxSpinnerService.show();
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
          this.ngxSpinnerService.hide();
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
          this.ngxSpinnerService.hide();
        });
    }
    if (command === "ata") {
      try {
        this.ngxSpinnerService.show();
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
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.ngxSpinnerService.hide();
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
            this.ngxSpinnerService.hide();
          });
      } catch {
        let errorMessage = "Modelo de contrato não cadastrado";

        switch (this.storedLanguage) {
          case "pt":
            errorMessage = "Modelo de contrato não cadastrado";
            break;
          case "en":
            errorMessage = "Unregistered contract template";
            break;
          case "fr":
            errorMessage = "Modèle de contrat non enregistré";
            break;
          case "es":
            errorMessage = "Modelo de contrato no registrado";
            break;
        }
        this.toastrService.error(errorMessage, "", { progressBar: true });
        this.ngxSpinnerService.hide();
      }
    }
    if (command === "arquivoComplementar") {
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
    }
  }

  delete(i: any): void {
    const trash = this.loteList.findIndex((lote: any) => lote._id === i._id);
    if (trash !== -1) this.loteList.splice(trash, 1);
  }

  viewProposal(i: any, value: string) {
    if (value === "proposal") this.router.navigate(["/pages/fornecedor/proposta"]);
    if (value === "edit") this.router.navigate(["/pages/fornecedor/proposta/atualizar"]);
    if (value === "create") {
      Object.assign(this.response, { typeSend: "create" });
      localStorage.setItem("enviarproposta", JSON.stringify(this.response));
      this.router.navigate(["/pages/fornecedor/proposta/enviar"]);
    }
    if (value === "send") {
      Object.assign(this.response, { typeSend: "send" });
      localStorage.setItem("enviarproposta", JSON.stringify(this.response));
      this.router.navigate(["/pages/fornecedor/proposta/enviar"]);
    }

    localStorage.setItem("lote", JSON.stringify(i));
  }

  handlerInProposal(id: string): boolean {
    return this.proposals?.proposals?.some((proposal: any) => {
      return proposal?.allotment?.some((allotment: any) => allotment._id === id);
    });
  }

  getVerify() {
    for (let iterator of this.response.add_allotment) {
      this.proposalService.getProposalVerify(iterator._id).subscribe({
        next: data => {
          if (data === true) {
            iterator = Object.assign(iterator, { disabledBtn: true });
          }
        },
      });
    }
  }

  updateProposal(id: string) {
    const proposal = this.proposals?.proposals?.find((proposal: any) => {
      return proposal?.allotment?.some((allotment: any) => allotment._id === id);
    });
    if (proposal) {
      this.router.navigate(["/pages/fornecedor/proposta/atualizar/" + proposal._id]);
    }
  }

  async downloadComplentary() {
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
  }
}
