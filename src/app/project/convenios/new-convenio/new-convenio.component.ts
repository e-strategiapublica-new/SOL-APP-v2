import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { states, cities } from "estados-cidades";
import { Location } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { ConvenioService } from "src/services/convenio.service";
import { ConvenioRequestDto } from "src/dtos/convenio/convenio-request.dto";
import { AssociationService } from "src/services/association.service";
import { AssociationResponseDto } from "src/dtos/association/association-response.dto";
import { UserService } from "src/services/user.service";
import { UserListResponseDto } from "src/dtos/user/user-list-response.dto";
import { UserTypeEnum } from "src/enums/user-type.enum";
import { AgreementStatusEnum } from "src/enums/agreement-status.enum";
import { distinctUntilChanged, filter } from "rxjs";
import { ProjectsService } from "src/services/projects.service";

@Component({
  selector: "app-new-convenio",
  templateUrl: "./new-convenio.component.html",
  styleUrls: ["./new-convenio.component.scss"],
})
export class NewConvenioComponent {
  form: FormGroup;

  statesList: string[] = states();
  citiesList: string[] = [];
  request: ConvenioRequestDto;
  associationList: AssociationResponseDto[];
  userList: any[];
  userListProject: UserListResponseDto[];
  agreementStatusEnum = AgreementStatusEnum;
  numberalert = "Número";
  objectalert = "Objeto";
  statealert = "Estado";
  cityalert = "Município de execução do convênio";
  pricealert = "Valor do Convênio (R$)";
  datesubalert = "Data da assinatura";
  datematalert = "Data de vigência";
  situationalert = "Situação";
  associationalert = "Associação";
  reviewalert = "Revisor";
  invalidDates: any = [false, false];
  year: number = new Date().getFullYear();
  selectedLanguage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private associationService: AssociationService,
    private convenioService: ConvenioService,
    private userService: UserService,
    private location: Location,
    private toastrService: ToastrService,
    private router: Router,
    private projectsService: ProjectsService
  ) {
    this.form = this.formBuilder.group({
      numberInsurance: [''],
      object: ['', [Validators.required]],
      price: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      datesub: ['', [Validators.required]],
      datemat: ['', [Validators.required]],
      situation: ['', [Validators.required]],
      association: ['', [Validators.required]],
      review: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getAssociation();
    this.getAdm();
    this.getProjectmanager();


    setInterval(() => {
      const localLanguage = localStorage.getItem('selectedLanguage');
      if (localLanguage) this.selectedLanguage = localLanguage;
    }, 1000);

  }

  getAssociation() {
    this.associationService.list().subscribe({
      next: success => {
        this.associationList = success;
      },
      error: error => {
        console.error(error);
      },
    });
  }

  getAdm() {
    this.projectsService.getProjects().subscribe({
      next: data => {
        this.userList = data;
         
      },
      error: err => {
        console.log(err)
      }
    })
    // this.userService.listByType(UserTypeEnum.administrador).subscribe({
    //   next: data => {
    //     this.userList = data;
    //   },
    //   error: err => {
    //     console.error(err);
    //   },
    // });
  }
  getProjectmanager() {
    this.userService.listByType(UserTypeEnum.project_manager).subscribe({
      next: data => {
        this.userListProject = data;
      },
      error: err => {
        console.error(err);
      },
    });
  }

  backConvenio() {
    this.location.back();
  }

  onSubmit() {

    this.request = {
      register_number: `${this.form.controls["numberInsurance"].value}/${this.year} `,
      register_object: this.form.controls["object"].value,
      states: this.form.controls["state"].value,
      city: this.form.controls["city"].value,
      value: +this.form.controls["price"].value,
      signature_date: this.form.controls["datesub"].value,
      validity_date: this.form.controls["datemat"].value,
      status: this.form.controls["situation"].value,
      associationId: this.form.controls["association"].value,
      projectId: this.form.controls["review"].value,
    };
    this.convenioService.register(this.request).subscribe({
      next: success => {
        this.toastrService.success("Criado com sucesso!", "", { progressBar: true });
        this.location.back();
      },
      error: error => {
        console.error(error);
        this.toastrService.error('', "Error ao criar!", { progressBar: true });
      },
    });
  }
  maxDate(): string {
    const currentDate = new Date();
    const threeYearsLater = new Date(currentDate.getFullYear() + 3, currentDate.getMonth(), currentDate.getDate());
    return threeYearsLater.toISOString().split('T')[0];
  }

  getCity(state: string) {
    this.citiesList = cities(state) || [];
  }
}
