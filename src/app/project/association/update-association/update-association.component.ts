import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssociationService } from 'src/services/association.service';
import { CepService } from 'src/services/cep.service';
import { NominatimService } from 'src/services/nominatim.service';
import UserDataValidator from 'src/utils/user-data-validator.utils';

@Component({
  selector: 'app-update-association',
  templateUrl: './update-association.component.html',
  styleUrls: ['./update-association.component.scss']
})
export class UpdateAssociationComponent implements OnInit {

  form!: FormGroup;
  formAddress!: FormGroup;
  formLegalRepresentative!: FormGroup;
  formLegalRepresentativeAddress!: FormGroup;
  isSubmit: boolean = false;
  associationId!: string;
  regex = /\b(\d)\1+\b/
  orgaoExpedidorRegex = /^[a-z]{3}\/?[a-z]/
  onlyLetters = /^[a-zA-Z]+$/
  storedLanguage: string | null
  ssp: any
  validCnpj: boolean = true
  // 27.865.757/0001-02
  constructor(
    private formBuilder: FormBuilder,
    private associationService: AssociationService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cepService: CepService,
    private nominatimService: NominatimService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      cnpj: ['', [Validators.required, Validators.minLength(14)]],
    });

    this.formAddress = this.formBuilder.group({
      zipCode: ['', [Validators.required, Validators.minLength(8)]],
      number: ['', [Validators.required]],
      publicPlace: ['', [Validators.required]],
      neighborhood: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      complement: [''],
      referencePoint: [''],
    });

    this.formLegalRepresentative = this.formBuilder.group({
      name: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      maritalStatus: ['', [Validators.required]],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
/*       rg: ['', [Validators.required]],
      document_origin: ['', [Validators.required]],
      validityData: ['', [Validators.required, this.dateValidator]] */
    });

    this.formLegalRepresentativeAddress = this.formBuilder.group({
      zipCode: ['', [Validators.required, Validators.minLength(8)]],
      number: ['', [Validators.required]],
      publicPlace: ['', [Validators.required]],
      neighborhood: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      // latitude: ['', [Validators.required]],
      // longitude: ['', [Validators.required]],
      complement: [''],
      referencePoint: [''],
    });

  }

  ngOnInit(): void {

    this.ngxSpinnerService.show();
    this.activatedRoute.params.subscribe((params) => {
      this.associationService.getById(params['id']).subscribe({
        next: (success) => {
          this.associationId = success._id;
          this.form.patchValue({
            name: success.name,
            cnpj: success.cnpj
          });

          this.formAddress.patchValue({
            zipCode: success.address.zipCode,
            number: success.address.number,
            publicPlace: success.address.publicPlace,
            neighborhood: success.address.neighborhood,
            city: success.address.city,
            state: success.address.state,
            complement: success.address.complement,
            referencePoint: success.address.referencePoint
          });

          this.formLegalRepresentative.patchValue({
            name: success.legalRepresentative.name,
            nationality: success.legalRepresentative.nationality,
            maritalStatus: success.legalRepresentative.maritalStatus,
            cpf: success.legalRepresentative.cpf,
           /*  rg: success.legalRepresentative.rg,
            document_origin: success.legalRepresentative.document_origin,
            validityData: success.legalRepresentative.validityData.toString().slice(0, 10) */
          });
          this.formLegalRepresentativeAddress.patchValue({
            zipCode: success.legalRepresentative.address.zipCode,
            number: success.legalRepresentative.address.number,
            publicPlace: success.legalRepresentative.address.publicPlace,
            neighborhood: success.legalRepresentative.address.neighborhood,
            city: success.legalRepresentative.address.city,
            state: success.legalRepresentative.address.state,
            // latitude: success.legalRepresentative.address.latitude,
            // longitude: success.legalRepresentative.address.longitude,
            complement: success.legalRepresentative.address.complement,
            referencePoint: success.legalRepresentative.address.referencePoint
          });

          this.ngxSpinnerService.hide();
        },
        error: (error) => {
          console.error(error);
          this.router.navigate(['/controle-admin']);
          this.ngxSpinnerService.hide();
        }
      });
    });

    this.storedLanguage = localStorage.getItem('selectedLanguage');

  }

  checkValidCnpj() {
    this.validCnpj = UserDataValidator.validarCNPJ(this.form.controls["cnpj"].value)
  }

  async searchCep() {

    let zipCode = this.formAddress.get('zipCode')?.value || '';
    if (zipCode.length < 8) return
    if (zipCode) {
      const cep = await this.cepService.buscarCep(zipCode)
      if (cep) {
        this.formAddress.patchValue({
          number: cep.numero,
          publicPlace: cep.logradouro,
          neighborhood: cep.bairro,
          city: cep.cidade,
          state: cep.uf,
          complement: cep.complemento,
        })
      }
      this.getLatLong(
        cep.logradouro,
        cep.cidade,
        'brazil',
        cep.uf,
      )
    }
  }
  formatInput(inputElement:any) {
    
  if (inputElement.target.id === 'document_origin') {
    if (!this.onlyLetters.test(inputElement)) {
      inputElement.target.value = inputElement.target.value.replace(/[^a-zA-Z]/g, '');

      if (inputElement.target.value.length > 3) {
       // inputElement.target.value = inputElement.target.value.slice(0, 3) + '/' + inputElement.target.value.slice(3, 5);
        this.formLegalRepresentative.controls["document_origin"].setValue(inputElement.target.value.slice(0, 3) + '/' + inputElement.target.value.slice(3, 5))
      }
    }
  } else if (inputElement.target.id === 'rg') {
    const lastCharacter = inputElement.target.value.length - 1
    this.formLegalRepresentative.controls["rg"].setValue(inputElement.target.value.slice(0, lastCharacter) + '-' + inputElement.target.value.slice(lastCharacter))
   
  }


  }

  async getLatLong(street: string, city: string, country: string, state: string) {
    const result: any = await this.nominatimService.getLatLongByAddress(
      street,
      city,
      country,
      state,
    );

    if (result && result.length > 0) {

      const lat = result[0].lat;
      const lng = result[0].lon;

      this.formAddress.patchValue({
        latitude: lat,
        longitude: lng,
      });
    }
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
  onSubmit() {

    this.isSubmit = true;
    if (this.formLegalRepresentative.valid) {
    }
    if (this.form.status == 'INVALID' || this.formAddress.status == 'INVALID'  ||
      this.formLegalRepresentativeAddress.status == 'INVALID') {
      return;
    }

    let dto = {
      ...this.form.value,
      address: { ...this.formAddress.value },
      legalRepresentative: { ...this.formLegalRepresentative.value, address: { ...this.formLegalRepresentativeAddress.value } },
    }

    this.ngxSpinnerService.show();
    this.associationService.update(this.associationId, dto).subscribe({
      next: (success) => {

        let successMessage = 'Associação editada com sucesso!';

        switch (this.storedLanguage) {
          case 'pt':
            successMessage = 'Associação editada com sucesso!'
            break;
          case 'en':
            successMessage = 'Association successfully edited!'
            break;
          case 'fr':
            successMessage = 'Association éditée avec succès !'
            break;
          case 'es':
            successMessage = '¡Asociación editada con éxito!'
            break;
        }

        this.ngxSpinnerService.hide();
        this.toastrService.success('Associação editada com sucesso!', '', { progressBar: true });
        this.router.navigate(['/pages/associacao']);
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
        this.ngxSpinnerService.hide();
      }
    });

  }

}
