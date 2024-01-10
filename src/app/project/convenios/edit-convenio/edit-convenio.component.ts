import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { states, cities } from "estados-cidades";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ConvenioService } from "src/services/convenio.service";
import { ConvenioResponseDto } from "src/dtos/convenio/convenio-response.dto";
import { ConvenioRequestDto } from "src/dtos/convenio/convenio-request.dto";
import { LocalStorageService } from "src/services/local-storage.service";
import { AssociationService } from "src/services/association.service";
import { UserService } from "src/services/user.service";
import { UserTypeEnum } from "src/enums/user-type.enum";
import { AssociationResponseDto } from "src/dtos/association/association-response.dto";
import { UserListResponseDto } from "src/dtos/user/user-list-response.dto";
import { AgreementStatusEnum } from "src/enums/agreement-status.enum";
import { ProjectsService } from "src/services/projects.service";
@Component({
  selector: "app-edit-convenio",
  templateUrl: "./edit-convenio.component.html",
  styleUrls: ["./edit-convenio.component.scss"],
})
export class EditConvenioComponent {
  form: FormGroup;
  statesList: string[] = states();
  citiesList: string[] = [];
  responseData: any;
  response: ConvenioResponseDto;

  request: ConvenioRequestDto;

  associationList: AssociationResponseDto[];
  userList: any[];
  userListProject: UserListResponseDto[];
  inputclear = false;
  agreementStatusEnum = AgreementStatusEnum;

  constructor(
    private formBuilder: FormBuilder,
    public localStorage: LocalStorageService,
    private userService: UserService,
    private location: Location,
    private toastrService: ToastrService,
    private associationService: AssociationService,
    private convenioService: ConvenioService,
    private route: ActivatedRoute,
    private projectsService: ProjectsService
  ) {
    this.form = this.formBuilder.group({
      number: ["", [Validators.required]],
      object: ["", [Validators.required]],
      price: ["", [Validators.required]],
      state: ["", [Validators.required]],
      city: ["", [Validators.required]],
      datesub: ["", [Validators.required]],
      datemat: ["", [Validators.required]],
      situation: ["", [Validators.required]],
      association: ["", [Validators.required]],
      review: [""],
      manager: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.response = this.route.snapshot.data["agreement"];
    console.log(this.response)
    const datesub = new Date(this.response.signature_date);
    const datemat = new Date(this.response.validity_date);

    this.form.patchValue({
      number: this.response.register_number,
      object: this.response.register_object,
      city: this.response.city,
      state: this.response.states,
      price: this.response.value,
      datesub: `${datesub.getDate() < 10 ? "0" + datesub.getDate() : datesub.getDate()}${
        datesub.getMonth() + 1 < 10 ? "0" + (datesub.getMonth() + 1) : datesub.getMonth() + 1
      }${datesub.getFullYear()}`,
      datemat: `${datemat.getDate() < 10 ? "0" + datemat.getDate() : datemat.getDate()}${
        datemat.getMonth() + 1 < 10 ? "0" + (datemat.getMonth() + 1) : datemat.getMonth() + 1
      }${datemat.getFullYear()}`,
      situation: this.response.status,
      association: this.response.association._id,
      review: this.response.project?._id,
      manager: this.response.manager?._id,
    });
    this.citiesList = cities(this.response.states);
    this.getAssociation();
    this.getAdm();
    this.getProjectmanager();
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
  }

  // getAdm() {
  //   this.userService.listByType(UserTypeEnum.administrador).subscribe({
  //     next: data => {
  //       this.userList = data;
  //     },
  //     error: err => {
  //       console.error(err);
  //     },
  //   });
  // }

  onSubmit() {
    if (this.form.invalid) return;

    this.request = {
      register_number: `${this.form.controls["number"].value}`,
      register_object: this.form.controls["object"].value,
      states: this.form.controls["state"].value,
      city: this.form.controls["city"].value,
      value: +this.form.controls["price"].value,
      signature_date: new Date(
        `${this.form.controls["datesub"].value.substring(2, 4)}/${this.form.controls["datesub"].value.substring(
          0,
          2
        )}/${this.form.controls["datesub"].value.substring(4, 8)}`
      ),
      validity_date: new Date(
        `${this.form.controls["datemat"].value.substring(2, 4)}/${this.form.controls["datemat"].value.substring(
          0,
          2
        )}/${this.form.controls["datemat"].value.substring(4, 8)}`
      ),
      status: this.form.controls["situation"].value,
      associationId: this.form.controls["association"].value,
      projectId: this.form.controls["review"].value,
      manager: this.form.controls["manager"].value,
    };

    this.convenioService.updateConvenio(this.response._id, this.request).subscribe({
      next: success => {
        this.toastrService.success("Atualizado com sucesso!", "", { progressBar: true });
        this.location.back();
      },
      error: error => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], "Error ao atualizado!", { progressBar: true });
      },
    });
  }

  backConvenio() {
    this.location.back();
  }

  getCity(state: string) {
    this.citiesList = cities(state) || [];
  }
}
