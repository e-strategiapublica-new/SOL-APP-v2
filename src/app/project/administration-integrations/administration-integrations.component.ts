import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { EndPointsInterface } from "src/app/interface/endpoints.interface";
import { EndPointsRegisterRequestDto } from "src/dtos/endpoints/endpoints-register-request.dto";
import { EndPointsStatusEnum } from "src/enums/endpoints-status.enum";
import { AssociationBidService } from "src/services/association-bid.service";
import { AuthService } from "src/services/auth.service";
import { EndPointsService } from "src/services/endpoints.service";

@Component({
  selector: "app-administration-integrations",
  templateUrl: "./administration-integrations.component.html",
  styleUrls: ["./administration-integrations.component.scss"],
})
export class AdministrationIntegrationsComponent {
  endpointList: EndPointsInterface[] = [];

  seeToken = new Map<string, boolean>()

  currentPage: number = 1;
  form: FormGroup;
  itensPerPage: number = 5;
  token = false;
  info = true;
  idList = -1;

  translate: string = '';

  constructor(
    private authbase: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private endPointsService: EndPointsService,
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
  ) {
    this.form = this.formBuilder.group({
      endpoint: ["", [Validators.required]],
      token: ["", [Validators.required]],
      frequency: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.authbase.getAuthenticatedUser().type !== "administrador") this.router.navigate(["/pages/dashboard"]);

    this.spinnerService.show();
    this.endPointsService.list().subscribe({
      next: response => {
        this.endpointList = response;
        this.endpointList.forEach(item => {
          this.seeToken.set(item._id, false);
        });
        this.spinnerService.hide();
      },
      error: error => {
        this.spinnerService.hide();
        console.error(error);
      },
    });

    // this.translateService.onLangChange.subscribe((lang: any) => {
    //   this.translate = lang.lang
    // });

  }

  detailBids(i: any) {
    this.router.navigate([`/pages/licitacoes/detalhes-licitacoes/${i._id}`]);
  }

  showToken(item: EndPointsInterface) {
    this.seeToken.set(item._id, !this.seeToken.get(item._id));
  }

  handlerEdit(i: number, items: EndPointsInterface) {
    this.form.patchValue({
      endpoint: items.endpointPath,
      token: items.token,
      frequency: items.frequency,
    });
    if (this.idList === i) this.idList = -1;
    else this.idList = i;
  }

  handlerSave(i: number, items: EndPointsInterface) {
    if (this.isCronValid(this.form.value.frequency)) {
      this.toastrService.error("Cron inválido!");
      return;
    }
    this.spinnerService.show();
    const request: EndPointsRegisterRequestDto = {
      ...items,
      endpointPath: this.form.value.endpoint,
      token: this.form.value.token,
      frequency: this.form.value.frequency,
    };
    this.endPointsService.update(items._id, request).subscribe({
      next: response => {
        if (this.idList === i) this.idList = -1;
        else this.idList = i;
        this.spinnerService.hide();
        this.toastrService.success("Endpoint atualizado com sucesso!");
        this.ngOnInit();
      },
      error: error => {
        this.spinnerService.hide();
        this.toastrService.error("Erro ao atualizar endpoint!");
        console.error(error);
      },
    });
  }

  handlerCancel(){
    this.idList = -1
    //this.ngOnInit();
  }

  handlerIconsByStatus(status: string) {
    switch (status) {
      case EndPointsStatusEnum.success:
        return "bi bi-check-circle-fill";
      case EndPointsStatusEnum.error:
        return "bi bi-exclamation-triangle-fill";
      case EndPointsStatusEnum.running:
        return "bi bi-arrow-repeat";
      case EndPointsStatusEnum.stopped:
        return "bi bi-stop-circle-fill";
      default:
        return "";
    }
  }

  handlerColorByStauts(status: string) {
    switch (status) {
      case EndPointsStatusEnum.success:
        return "text-success";
      case EndPointsStatusEnum.error:
        return "text-danger";
      case EndPointsStatusEnum.running:
        return "text-warning";
      case EndPointsStatusEnum.stopped:
        return "text-secondary";
      default:
        return "";
    }
  }

  forceJob(item: EndPointsInterface) {
    this.spinnerService.show();
    this.endPointsService.forceJob(item.endpointType).subscribe({
      next: response => {
        this.spinnerService.hide();
        this.toastrService.success("Integração executado com sucesso!");
        this.ngOnInit();
      },
      error: error => {
        this.spinnerService.hide();
        this.toastrService.error("Erro ao executar integração!");
        console.error(error);
      },
    });
  }

  isCronValid(freq: string) {
    const cronregex = new RegExp(
      /^(((\*|(\d\d?))(\/\d\d?)?)|(\d\d?\-\d\d?))(,(((\*|(\d\d?))(\/\d\d?)?)|(\d\d?\-\d\d?)))*\s(((\*|(\d\d?))(\/\d\d?)?)|(\d\d?\-\d\d?))(,(((\*|(\d\d?))(\/\d\d?)?)|(\d\d?\-\d\d?)))*\s(((\*|(\d\d?))(\/\d\d?)?)|(\d\d?\-\d\d?))(,(((\*|(\d\d?))(\/\d\d?)?)|(\d\d?\-\d\d?)))*\s(\?|(((\*|(\d\d?L?))(\/\d\d?)?)|(\d\d?L?\-\d\d?L?)|L|(\d\d?W))(,(((\*|(\d\d?L?))(\/\d\d?)?)|(\d\d?L?\-\d\d?L?)|L|(\d\d?W)))*)\s(((\*|(\d|10|11|12|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))(\/\d\d?)?)|((\d|10|11|12|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\-(\d|10|11|12|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)))(,(((\*|(\d|10|11|12|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))(\/\d\d?)?)|((\d|10|11|12|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\-(\d|10|11|12|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))))*\s(((\*|([0-7]|MON|TUE|WED|THU|FRI|SAT|SUN)L?)(\/\d\d?)?)|(([0-7]|MON|TUE|WED|THU|FRI|SAT|SUN)L?\-([0-7]|MON|TUE|WED|THU|FRI|SAT|SUN)L?)|([0-7]|MON|TUE|WED|THU|FRI|SAT|SUN)L?#([1-5]))(,(((\*|([0-7]|MON|TUE|WED|THU|FRI|SAT|SUN)L?)(\/\d\d?)?)|(([0-7]|MON|TUE|WED|THU|FRI|SAT|SUN)L?\-([0-7]|MON|TUE|WED|THU|FRI|SAT|SUN)L?)|([0-7]|MON|TUE|WED|THU|FRI|SAT|SUN)L?#([1-5])))*$/
    );
    return cronregex.test(freq);
  }
}
