import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";
import { forkJoin } from "rxjs";
import { BidStatusEnum } from "src/enums/bid-status.enum";
import { AllotmentsService } from "src/services/allotments.service";
import { AssociationBidService } from "src/services/association-bid.service";
import { AuthService } from "src/services/auth.service";
import { SupplierService } from "src/services/supplier.service";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { AllotmentResponseDto } from "src/dtos/allotment/allotment-response.dto";
import { WorkPlanService } from "src/services/work-plan.service";
import { WorkPlanProductInterface, WorkPlanRegisterRequest } from "src/dtos/workPlan/work-plan-register-request.dto";
import { ModelContractClassificationEnum } from "src/enums/modelContract-classification.enum";
import { LanguageContractEnum } from "src/enums/language-contract.enum";
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-associacao-licitacao-data",
  templateUrl: "./associacao-licitacao-data.component.html",
  styleUrls: ["./associacao-licitacao-data.component.scss"],
})
export class AssociacaoLicitacaoDataComponent {
  licitacao!: any | undefined;
  blockSupplier!: FormGroup;
  idSupplier!: boolean;
  isSectionOneOpen: boolean = false;
  isSectionTwoOpen: boolean = false;
  invitedSuppliersIds: any;
  invitedSuppliersInfo: any;
  response: any;
  prazoEmdias: number;
  allAllotmentsList: any;
  date = new Date();

  storedLanguage: string | null;
  responseAddAlloment: AllotmentResponseDto[];
  workPlanId: any;
  quantityItems: any;
  quantityLotes: string;
  workplandto: WorkPlanRegisterRequest;
  user: any

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private location: Location,
    private translate: TranslateService,
    private associationBidService: AssociationBidService,
    private bidService: AssociationBidService,
    private workPlanService: WorkPlanService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private router: Router,
    private supplierService: SupplierService,
    private allotmentsService: AllotmentsService,
    private spinnerService: NgxSpinnerService,
  ) {
    this.blockSupplier = this.formBuilder.group({
      message: [""],
    });
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.route.data.subscribe({
      next: data => {
        this.response = data["bid"];
        console.log(this.response)
      },
    });
    this.prazoEmdias = this.calcularPrazoEmDias(this.response.start_at, this.response.end_at);

    this.storedLanguage = localStorage.getItem("selectedLanguage");
  }

  calcularPrazoEmDias(prazoInicial: any, prazoFinal: any) {
    const dataInicial = new Date(prazoInicial);
    const dataFinal = new Date(prazoFinal);

    const diferencaEmMilissegundos = dataFinal.getTime() - dataInicial.getTime();

    const umDiaEmMilissegundos = 24 * 60 * 60 * 1000;
    const diferencaEmDias = Math.floor(diferencaEmMilissegundos / umDiaEmMilissegundos);

    return diferencaEmDias;
  }

  open(contentBlocked: any) {
    this.modalService.open(contentBlocked, { size: "lg" });
  }

  deleteBid(bid: any) {
    this.modalService.open(bid, { size: "lg" });
  }

  confirmDeleteBid() {
    this.responseAddAlloment = this.response.add_allotment;
    for (let i = 0; i < this.responseAddAlloment.length; i++) {
      for (let x = 0; x < this.responseAddAlloment[i].add_item.length; x++) {
        this.quantityLotes = this.responseAddAlloment[i].add_item[x].quantity;
      }
    }
    this.workPlanId = this.response.agreement.workPlan;
    const listIdworkPlan = this.response.agreement.workPlan.map((id: string) => this.workPlanService.getById(id));
    forkJoin(listIdworkPlan).subscribe({
      next: (responses: any) => {
        // console.log('foi tudo', responses)
        for (let i = 0; i < responses.length; i++) {
          const workPlan = responses[i];
          const updatedProducts = workPlan.product.map((item: WorkPlanProductInterface) => {
            const actualQuantity = item.quantity + Number(this.quantityLotes);
            return {
              quantity: actualQuantity,
              unitValue: item.unitValue,
              costItems: item.costItems,
            };
          });
          const updatedWorkPlan: WorkPlanRegisterRequest = {
            name: workPlan.name,
            product: updatedProducts,
          };
          // console.log(updatedWorkPlan);
          this.workPlanService.update(workPlan._id, updatedWorkPlan).subscribe({
            next: (response: any) => {
              // console.log('foi tudo', response);
            },
            error: err => {
              console.error(err);
            },
          });
        }
      },
      error: err => {
        console.error(err);
      },
    });
    // console.log(listIdworkPlan)

    this.associationBidService.deleteBid(this.response._id).subscribe({
      next: data => {
        console.log("success");
        this.modalService.dismissAll();
        this.location.back();
      },
      error: error => {
        console.error("error", error);
      },
    });
  }

  async openModal(command: string, item: any = this.response) {
    if (this.response !== null) {
      localStorage.setItem("bidId", this.response._id);
    }

    if (command === "contract") this.router.navigate(["/pages/licitacoes/contratos-licitacoes"]);
  }

  openUnblockModal(contentUnBlocked: any) {
    this.modalService.open(contentUnBlocked, { size: "lg" });
  }

  exit() {
    this.modalService.dismissAll();
  }

  toggleSectionOne(allotment: any) {
    allotment.isSectionOpen = !allotment.isSectionOpen;
  }

  toggleSectionTwo() {
    this.isSectionTwoOpen = !this.isSectionTwoOpen;
  }

  findSuppliersById() {
    const observables = this.invitedSuppliersIds.map((id: string) => this.supplierService.getById(id));

    forkJoin(observables).subscribe({
      next: responses => {
        this.invitedSuppliersInfo = responses;
      },
      error: err => {
        console.error(err);
      },
    });
  }

  cancelStatus() {
    let request = {
      status: "canceled",
    };

    this.responseAddAlloment = this.response.add_allotment;
    for (let i = 0; i < this.responseAddAlloment.length; i++) {
      for (let x = 0; x < this.responseAddAlloment[i].add_item.length; x++) {
        this.quantityLotes = this.responseAddAlloment[i].add_item[x].quantity;
      }
    }
    this.workPlanId = this.response.agreement.workPlan;
    const listIdworkPlan = this.response.agreement.workPlan.map((id: string) => this.workPlanService.getById(id));
    forkJoin(listIdworkPlan).subscribe({
      next: (responses: any) => {
        // console.log('foi tudo', responses)
        for (let i = 0; i < responses.length; i++) {
          const workPlan = responses[i];
          const updatedProducts = workPlan.product.map((item: WorkPlanProductInterface) => {
            const actualQuantity = item.quantity + Number(this.quantityLotes);
            return {
              quantity: actualQuantity,
              unitValue: item.unitValue,
              costItems: item.costItems,
            };
          });
          const updatedWorkPlan: WorkPlanRegisterRequest = {
            name: workPlan.name,
            product: updatedProducts,
          };
          // console.log(updatedWorkPlan);
          this.workPlanService.update(workPlan._id, updatedWorkPlan).subscribe({
            next: (response: any) => {
              // console.log('foi tudo', response);
            },
            error: err => {
              console.error(err);
            },
          });
        }
      },
      error: err => {
        console.error(err);
      },
    });
    // console.log(listIdworkPlan)

    this.associationBidService.changeStatus(this.response._id, request).subscribe({
      next: data => {
        let successMessage = "Licitação cancelada com sucesso!";

        switch (this.storedLanguage) {
          case "pt":
            successMessage = "Licitação cancelada com sucesso!";
            break;
          case "en":
            successMessage = "Bid canceled successfully!";
            break;
          case "fr":
            successMessage = "Enchère annulée avec succès !";
            break;
          case "es":
            successMessage = "¡Puja cancelada con éxito!";
            break;
        }

        const toastr = this.toastrService.success(successMessage, "", { progressBar: true });
        this.modalService.dismissAll();
        if (toastr) {
          toastr.onHidden.subscribe(() => {
            this.modalService.dismissAll();
            this.router.navigate(["/pages/associacao/licitacoes"]);
          });
        }
      },
      error: error => {
        let errorMessage = "Erro ao recusar licitação!";

        switch (this.storedLanguage) {
          case "pt":
            errorMessage = "Erro ao recusar licitação!";
            break;
          case "en":
            errorMessage = "Error rejecting bid!";
            break;
          case "fr":
            errorMessage = "Erreur lors du rejet de l'enchère !";
            break;
          case "es":
            errorMessage = "¡Error al rechazar la oferta!";
            break;
        }

        this.toastrService.error(errorMessage, "", { progressBar: true });
      },
    });
  }

  acceptStatus() {
    let request = {
      status: BidStatusEnum.awaiting,
    };
    this.associationBidService.changeStatus(this.response._id, request).subscribe({
      next: data => {
        let successMessage = "Licitação enviada com sucesso!";

        switch (this.storedLanguage) {
          case "pt":
            successMessage = "Licitação enviada com sucesso!";
            break;
          case "en":
            successMessage = "Bid sent successfully!";
            break;
          case "fr":
            successMessage = "Enchère envoyée avec succès !";
            break;
          case "es":
            successMessage = "¡Oferta enviada con éxito!";
            break;
        }

        const toastr = this.toastrService.success(successMessage, "", { progressBar: true });
        this.modalService.dismissAll();
        if (toastr) {
          toastr.onHidden.subscribe(() => {
            this.modalService.dismissAll();
            this.router.navigate(["/pages/associacao/licitacoes"]);
          });
        }
      },
      error: error => {
        let errorMessage = "Erro ao recusar licitação!";

        switch (this.storedLanguage) {
          case "pt":
            errorMessage = "Erro ao recusar licitação!";
            break;
          case "en":
            errorMessage = "Error rejecting bid!";
            break;
          case "fr":
            errorMessage = "Erreur lors du rejet de l'enchère !";
            break;
          case "es":
            errorMessage = "¡Error al rechazar la oferta!";
            break;
        }

        this.toastrService.error(errorMessage, "", { progressBar: true });
      },
    });
  }

  downloadFile(base64: string) {
    const byteCharacters = atob(base64.substr(base64.indexOf(",") + 1));
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "file.pdf";
    link.click();
  }

  download(_id: string) {
    this.allotmentsService.download(_id).subscribe((response: any) => {
      const blob = new Blob([response], { type: "application/pdf" });
      let url = window.URL.createObjectURL(blob);
      window.open(url);
      // const url = URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = 'file.pdf';
      // link.click();
    });
  }

  getFileName(filePath: string): string {
    const splited = filePath.split("/");
    return splited[splited.length - 1];
  }

  getClassStatus(status: string) {
    return "";
  }

  goViewProposals() {
    this.router.navigate([`associacao/licitacoes/view-proposal/${this.response._id}`]);
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
  async downloadEdital() {
    try {
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
    } catch {
      let errorMessage = "Modelo de edital não cadastrado";

      switch (this.storedLanguage) {
        case "pt":
          errorMessage = "Modelo de edital não cadastrado";
          break;
        case "en":
          errorMessage = "Unregistered bid/tender notice template";
          break;
        case "fr":
          errorMessage = "Modèle d'avis d'appel d'offres non enregistré";
          break;
        case "es":
          errorMessage = "Modelo de convocatoria no registrado";
          break;
      }

      this.toastrService.error(errorMessage, "", { progressBar: true });
      this.spinnerService.hide();
    }
  }

  async downloadAta() {
    try {
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
      this.spinnerService.hide();
    }
  }
}
