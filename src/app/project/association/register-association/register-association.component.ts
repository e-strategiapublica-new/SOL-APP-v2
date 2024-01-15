import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssociationService } from 'src/services/association.service';
import { CepService } from '../../../../services/cep.service';
import { CepResponseDto } from '../../../../dtos/address/cep-response.dto';
import { NominatimService } from '../../../../services/nominatim.service';
import UserDataValidator from 'src/utils/user-data-validator.utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register-association',
  templateUrl: './register-association.component.html',
  styleUrls: ['./register-association.component.scss']
})
export class RegisterAssociationComponent implements OnInit {

  form!: FormGroup;
  formAddress!: FormGroup;
  formLegalRepresentative!: FormGroup;
  formLegalRepresentativeAddress!: FormGroup;
  isSubmit: boolean = false;
  regex = /\b(\d)\1+\b/
  language: string;
  validCnpj: boolean = true

  storedLanguage: string | null

  @ViewChild('addressnumber') inputNumber: ElementRef;
  @ViewChild('addressnumberlegal') inputNumberLegalRepresentative: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private associationService: AssociationService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private cepService: CepService,
    private nominatimService: NominatimService,
    private translate: TranslateService,
  ) {

    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      cnpj: ['', [Validators.required, Validators.minLength(14)]],
    });

    this.formAddress = this.formBuilder.group({
      zipCode: ['', [Validators.required, Validators.minLength(8)]],
      number: [''],
      publicPlace: ['', [Validators.required]],
      neighborhood: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      complement: [''],
      referencePoint: [''],
      latitude: [''],
      longitude: ['']
    });

    this.formLegalRepresentative = this.formBuilder.group({
      name: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      maritalStatus: ['', [Validators.required]],
      cpf: ['', [Validators.required, Validators.minLength(11)]]
    });

    this.formLegalRepresentativeAddress = this.formBuilder.group({
      zipCode: ['', [Validators.required, Validators.minLength(8)]],
      number: [''],
      publicPlace: ['', [Validators.required]],
      neighborhood: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      complement: [''],
      referencePoint: [''],
    });

    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }


  ngOnInit(): void {
    this.language = localStorage.getItem('selectedLanguage')
  }

  rgValidator() {
    return (control: AbstractControl) => {
      const rgValue = control.value;
      if (!/^\d*X?x?$/.test(rgValue)) {
        return { 'invalidRG': true };
      }
      return null;
    };
  }

  checkValidCnpj() {
    this.validCnpj = UserDataValidator.validarCNPJ(this.form.controls["cnpj"].value)
  }

  onRGInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value.replace(/[^0-9Xx]/g, '');
    inputElement.value = newValue.toUpperCase();
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

  isCPFInvalidAndTouched(): boolean {
    const cpfControl = this.formLegalRepresentative.controls['cpf'];

    return cpfControl.dirty && !this.validarCPF(cpfControl.value);
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

  maxDate(): string {
    const currentDate = new Date();
    const threeYearsLater = new Date(currentDate.getFullYear() + 20, currentDate.getMonth(), currentDate.getDate());
    return threeYearsLater.toISOString().split('T')[0];
  }

  async onSubmit() {

    this.isSubmit = true;
    if (this.formLegalRepresentative.valid) {
    }
    if (this.form.status == 'INVALID' || this.formAddress.status == 'INVALID' || this.formLegalRepresentativeAddress.status == 'INVALID') {
      return;
    }
    
    const res = await this.getLatLong();
    this.formAddress.controls['latitude'].setValue(res.latitude)
    this.formAddress.controls['longitude'].setValue(res.longitude)
    
    const dto = {
      ...this.form.value,
      address: { ...this.formAddress.value },
      legalRepresentative: { ...this.formLegalRepresentative.value, address: { ...this.formLegalRepresentativeAddress.value } },
    }

    this.ngxSpinnerService.show();
    this.associationService.register(dto).subscribe({
      next: (success) => {

        let successMessage = 'Associação cadastrada com sucesso!';

        switch (this.storedLanguage) {
          case 'pt':
            successMessage = 'Associação cadastrada com sucesso!'
            break;
          case 'en':
            successMessage = 'Association successfully registered!'
            break;
          case 'fr':
            successMessage = 'Association enregistrée avec succès!'
            break;
          case 'es':
            successMessage = '¡Asociación registrada con éxito!'
            break;
        }

        this.ngxSpinnerService.hide();
        this.toastrService.success(successMessage, '', { progressBar: true });
        this.router.navigate(['/pages/associacao'])
      },
      error: (error) => {       

        if(!error){
          this.toastrService.error(this.translate.instant('TOASTRS.INTERNAL_SERVER_ERROR'), '', { progressBar: true });
          return;    
        }

        switch(error.error.code){
          case 1:
            this.toastrService.error(this.translate.instant('ERROR_MESSAGES.DUPLICATE_ASSOCIATION_ERROR'), '', { progressBar: true });
            return;    
        }
        
        this.ngxSpinnerService.hide();
      }
    });

  }

  async searchAssociationAddressByCep(event: any) {

    if (event.target.value) {

      let cep: string = event.target.value.replace('.', '');
      cep = cep.replace('-', '');

      if (cep.length === 8) {

        const response = await this.searchCep(cep);

        this.formAddress.patchValue({
          publicPlace: response.logradouro,
          neighborhood: response.bairro,
          city: response.cidade,
          state: response.uf,
        });

        this.inputNumber.nativeElement.focus();
      }
    }
  }

  async searchLegalRepresentativeAddressByCep(event: any) {

    if (event.target.value) {

      let cep: string = event.target.value.replace('.', '');
      cep = cep.replace('-', '');

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

  async getLatLong() {

    const address = this.formAddress.value;
    
    if(address.publicPlace && address.city && address.state){

      const result: any = await this.nominatimService.getLatLongByAddress(
        address.publicPlace,
        address.city,
        'brazil',
        address.state,
      );    

      if (result && result.length > 0) {

        const latitude = result[0].lat;
        const longitude = result[0].lon;

        return { "latitude": latitude, "longitude": longitude }
        
      }

    }

    return { "latitude": "", "longitude": "" }
  }
}
