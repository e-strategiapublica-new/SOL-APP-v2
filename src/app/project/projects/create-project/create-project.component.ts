import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CepResponseDto } from 'src/dtos/address/cep-response.dto';
import { ConvenioResponseDto } from 'src/dtos/convenio/convenio-response.dto';
import { ProjectRegisterRequestDto } from 'src/dtos/projects/project-register-request.dto';
import { AddressDto } from 'src/dtos/shared/address.dto';
import { LegalRepresentativeDto } from 'src/dtos/shared/legal.representative.dto';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { AgreementActiveStatusEnum } from 'src/enums/agreement-active-status.enum';
import { UserRolesEnum } from 'src/enums/user-roles.enum';
import { UserTypeEnum } from 'src/enums/user-type.enum';
import { CepService } from 'src/services/cep.service';
import { ConvenioService } from 'src/services/convenio.service';
import { NominatimService } from 'src/services/nominatim.service';
import { ProjectsService } from 'src/services/projects.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

  form: FormGroup
  isSubmit: boolean = false;
  formLegalRepresentative!: FormGroup;
  formLegalRepresentativeAddress!: FormGroup;

  userListProject: UserListResponseDto[];
  userViewerList: UserListResponseDto[] 
  storedReviewer: any[] = []
  storedViewer: any[] = []
  userSelectedList: any[] = [];

  agreementList: ConvenioResponseDto[] = [];
  selectAgreementList: ConvenioResponseDto[] = [];
  representativeName: string 
  viewerSelected: any = "1"
  reviewerSelected: any = "1"
  
  projectReviewer: any[]
  projectSecondReviewer: any[]   = []

  ngSelectReViewer: string = "1"
  ngSelectViewer: string = "1"

  @ViewChild("addressnumberlegal") inputNumberLegalRepresentative: ElementRef;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private projectsService: ProjectsService,
    private toastrService: ToastrService,
    private convenioService: ConvenioService,
    private router: Router,
    private translate: TranslateService,
    private nominatimService: NominatimService,
    private cepService: CepService
  ) {
    this.form = this.fb.group({
      name: [''],
      manager: [''],
      agreements: [''],
      reviewerList: [],
      reviewer_list: []
      
      
    })
    this.formLegalRepresentative = this.fb.group({
      name: [this.representativeName, [Validators.required]],
      nationality: ["", [Validators.required]],
      maritalStatus: ["", [Validators.required]],
      cpf: ["", [Validators.required, Validators.minLength(11)]],
/*       rg: ['', [Validators.required, this.rgValidator()]],
      document_origin: ["", [Validators.required, Validators.pattern(/^[A-Za-z/]+$/)]],
      validityData: ["", [Validators.required, this.dateValidator]], */
    });

    this.formLegalRepresentativeAddress = this.fb.group({
      zipCode: ["", [Validators.required, Validators.minLength(8)]],
      number: ["", [Validators.required]],
      publicPlace: ["", [Validators.required]],
      neighborhood: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      complement: [""],
      referencePoint: [""],
    });
  }

  ngOnInit(): void {
    this.getProjectmanager();
    // this.agreementsWithoutProject();
    this.getProjectViewerList()
  }

  getProjectmanager() {
    this.userService.listByType(UserTypeEnum.project_manager).subscribe({
      next: data => {        
        this.userListProject = data;
       // this.projectReviewer = data.filter((item => item.roles? item.roles === UserRolesEnum.revisor_projetos: ''))
        this.projectReviewer = data.filter(obj => obj.roles == "revisor_projetos" );        
      },
      error: err => {
        console.error(err);
      },
    });
  }
  selectedManager(event: any) {
        
    this.representativeName = event.target.value
    this.representativeName = this.userListProject.find(item => item._id === event.target.value).name
    if(this.representativeName) {
      if( this.storedReviewer.length > 0) {
        this.projectReviewer.push(this.storedReviewer[0])
        this.storedReviewer.pop()
      }
      if( this.storedViewer.length > 0) {
        this.userViewerList.push(this.storedViewer[0])
        this.storedViewer.pop()
      }
      this.storedViewer = this.userViewerList.filter((item) => item._id === event.target.value)
      this.storedReviewer =  this.projectReviewer.filter((ele) => ele._id === event.target.value)
      this.userViewerList = this.userViewerList.filter( (item) => item._id !== event.target.value)
      this.projectReviewer = this.projectReviewer.filter( (item) => item._id !== event.target.value)

    }
  }
  selectReViewer(event: any) {
    // this.userSelectedList.push(this.userViewerList.filter(item => item._id === event.target.value )[0]) 
    // this.userViewerList =  this.userViewerList.filter(ele =>   ele._id !== event.target.value)
    this.reviewerSelected = event.target.value    
  }

  selectViewer(event: any) {
    // this.userSelectedList.push(this.userViewerList.filter(item => item._id === event.target.value )[0]) 
    // this.userViewerList =  this.userViewerList.filter(ele =>   ele._id !== event.target.value)

    this.viewerSelected = event.target.value

    
  }
  handleAddReviewer(event: any) { 

    if(this.reviewerSelected != "1"){
      this.projectSecondReviewer.push(this.projectReviewer.filter(item => item._id === this.reviewerSelected)[0]) 
      this.projectReviewer =  this.projectReviewer.filter(ele => ele._id !== this.reviewerSelected)        
      this.reviewerSelected = "1"
    }
  }

  handleAddSupplier(event: any) {  
    if(this.viewerSelected != "1"){
      this.userSelectedList.push(this.userViewerList.filter(item => item._id === this.viewerSelected)[0]) 
      this.userViewerList = this.userViewerList.filter(ele => ele._id !== this.viewerSelected)        
      this.viewerSelected = "1"
    }
  }



  removeReViewer(index: number) {
    this.projectReviewer.push(this.projectSecondReviewer.splice(index, 1)[0]);
    this.reviewerSelected = "1"
    this.ngSelectReViewer = "1"
  }

  removeViewer(index: number) {
    this.userViewerList.push(this.userSelectedList.splice(index, 1)[0]);          
    this.viewerSelected = "1"
    this.ngSelectViewer = "1"    
  }

  validarCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    if (cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999")
      return false;
    let add = 0;
    for (let i = 0; i < 9; i++)
      add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
      return false;
    add = 0;
    for (let i = 0; i < 10; i++)
      add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
      return false;
    return true;
  };

  dateValidator(control: any): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    const maxDate = new Date(currentDate);
    maxDate.setFullYear(currentDate.getFullYear() + 20);

    if (selectedDate < currentDate) {
      return { 'dateError': 'A data não pode ser menor que hoje.' };
    } else if (selectedDate > maxDate) {
      return { 'dateError': 'A data não pode ser mais do que 20 anos após a data atual.' };
    }

    return null;
  }

  isCPFInvalidAndTouched(): any {
    const cpfControl = this.formLegalRepresentative.controls['cpf'];

    return cpfControl.dirty && !this.validarCPF(cpfControl.value);
  };

  rgValidator() {
    return (control: AbstractControl) => {
      const rgValue = control.value;
      if (!/^\d*X?x?$/.test(rgValue)) {
        return { 'invalidRG': true };
      }
      return null;
    };
  }

  onRGInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value.replace(/[^0-9Xx]/g, '');
    inputElement.value = newValue.toUpperCase();
  }

  maxDate(): string {
    const currentDate = new Date();
    const threeYearsLater = new Date(currentDate.getFullYear() + 20, currentDate.getMonth(), currentDate.getDate());
    return threeYearsLater.toISOString().split('T')[0];
  }

  async searchLegalRepresentativeAddressByCep(event: any) {
    if (event.target.value) {
      let cep: string = event.target.value.replace(".", "");
      cep = cep.replace("-", "");

      if (cep.length === 8) {
        const response = await this.searchCep(cep);

        this.formLegalRepresentativeAddress.patchValue({
          publicPlace: response.logradouro,
          neighborhood: response.bairro,
          city: response.cidade,
          state: response.uf,
        });

        this.inputNumberLegalRepresentative.nativeElement.focus();
      }
    }
  }

  async searchCep(cep: string): Promise<CepResponseDto> {
    return await this.cepService.buscarCep(cep);
  }

  async getLatLong(event: any) {
    const address = { ...this.form.value };

    const result: any = await this.nominatimService.getLatLongByAddress(
      address.publicPlace,
      address.city,
      "brazil",
      address.state
    );

    let lat = 1;
    let lng = 1;

    if (result.length > 0) {
      lat = result[0].lat;
      lng = result[0].lon;
    }

    // this.formAddress.patchValue({
    //   latitude: lat,
    //   longitude: lng,
    // });
  }


  // agreementsWithoutProject(): void {
  //   this.convenioService.getConvenioWithoutProject().subscribe({
  //     next: data => {
  //       // this.agreementList = data.filter((convenio: ConvenioResponseDto) => convenio.activeStatus === AgreementActiveStatusEnum.active)
  //       this.agreementList = data
  //     },
  //     error: err => {
  //       console.error(err)
  //     }
  //   })
  // }

  getProjectViewerList(): void {
    this.userService.listByRole(UserRolesEnum.visualizador_projetos).subscribe({
      next: data => {
        this.userViewerList = data
      },
      error: err => {
        console.error(err)
      }
    })
  }

  onSubmit() {

    this.isSubmit = true;
    const dto: ProjectRegisterRequestDto = {
      name: this.form.controls['name'].value,
      project_manager: this.form.controls['manager'].value,
      agreement: this.form.controls['agreements'].value,
      agreement_list: this.selectAgreementList?.map(agreements => agreements._id || "") || [],
      legalRepresentative: new LegalRepresentativeDto(),
      viewer_list: this.userSelectedList,
      reviewer_list: this.projectSecondReviewer
    }
    dto.legalRepresentative.name = this.form.controls['name'].value;
    dto.legalRepresentative.nationality = this.formLegalRepresentative.controls["nationality"].value;
    dto.legalRepresentative.maritalStatus = this.formLegalRepresentative.controls["maritalStatus"].value;
    dto.legalRepresentative.cpf = this.formLegalRepresentative.controls["cpf"].value;
    /* dto.legalRepresentative.rg = this.formLegalRepresentative.controls["rg"].value;
    dto.legalRepresentative.document_origin = this.formLegalRepresentative.controls["document_origin"].value;
    dto.legalRepresentative.validityData = this.formLegalRepresentative.controls["validityData"].value; */

    dto.legalRepresentative.address = new AddressDto();
    dto.legalRepresentative.address.complement =
      this.formLegalRepresentativeAddress.controls["complement"].value;
      dto.legalRepresentative.address.city = this.formLegalRepresentativeAddress.controls["city"].value;
      dto.legalRepresentative.address.neighborhood =
      this.formLegalRepresentativeAddress.controls["neighborhood"].value;
      dto.legalRepresentative.address.number = this.formLegalRepresentativeAddress.controls["number"].value;
      dto.legalRepresentative.address.publicPlace =
      this.formLegalRepresentativeAddress.controls["publicPlace"].value;
      dto.legalRepresentative.address.referencePoint =
      this.formLegalRepresentativeAddress.controls["referencePoint"].value;
      dto.legalRepresentative.address.state = this.formLegalRepresentativeAddress.controls["state"].value;
      dto.legalRepresentative.address.zipCode = this.formLegalRepresentativeAddress.controls["zipCode"].value;
         
    if(       
        !this.formLegalRepresentative.controls['nationality'].value ||
        !this.formLegalRepresentative.controls['maritalStatus'].value ||
        !this.formLegalRepresentative.controls['cpf'].value ||        
        !this.form.controls['name'].value ||
        !this.form.controls['manager'].value ||        
        !this.formLegalRepresentativeAddress.controls["zipCode"].value ||
        !this.formLegalRepresentativeAddress.controls["publicPlace"].value ||
        !this.formLegalRepresentativeAddress.controls['number'].value ||
        !this.formLegalRepresentativeAddress.controls['state'].value ||
        !this.formLegalRepresentativeAddress.controls['city'].value ||
        !this.formLegalRepresentativeAddress.controls['neighborhood'].value
      ){      
      return
    }
    

    this.projectsService.registerProject(dto).subscribe({
      next: data => {
        this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_CREATE_PROJECT'), '', { progressBar: true });
        this.router.navigate(['/pages/projetos'])
      },
      error: error => {
        
        if(!error){
          this.toastrService.error(this.translate.instant('TOASTRS.INTERNAL_SERVER_ERROR'), '', { progressBar: true });
          return;    
        }

        switch(error.error.code){
          case 1:
            this.toastrService.error(this.translate.instant('ERROR_MESSAGES.EXISTING_PROJECT'), '', { progressBar: true });
            return;    
        }

      }
    })

  }

  handleAgreements() {
    if (this.form.controls["agreements"].value) {
      const selected = this.agreementList.find(
        a => a._id?.toString() === this.form.controls["agreements"].value
      );
      const agreementExists = this.selectAgreementList.some(item => item._id === selected?._id);
      if (selected && !agreementExists) {
        this.selectAgreementList.push(selected!);
      }
    }
  }



  removeAgreements(index: number) {
    this.selectAgreementList.splice(index, 1);
  }

  cancel(){      
    localStorage.setItem('id_projects','0');
    this.router.navigate(['/pages/projetos']);
  }

}
