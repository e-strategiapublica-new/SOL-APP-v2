import { LocalStorageKeysEnum } from 'src/enums/local-storage-keys.enum';
import { UserService } from 'src/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CepResponseDto } from "../../../dtos/address/cep-response.dto";
import { CepService } from "../../../services/cep.service";
import { NominatimService } from "../../../services/nominatim.service";
import { SupplierRegisterDto } from "../../../dtos/supplier/supplier-register-request.dto";
import { AddressDto } from "../../../dtos/shared/address.dto";
import { LegalRepresentativeDto } from "../../../dtos/shared/legal.representative.dto";
import { SupplierService } from "../../../services/supplier.service";
import { CategoryService } from "../../../services/category.service";
import { CategoryResponseDto } from "../../../dtos/category/category-response.dto";
import { TranslateService } from "@ngx-translate/core";
import UserDataValidator from "src/utils/user-data-validator.utils";
import { Location } from '@angular/common';
 
@Component({
  selector: 'app-register-supplier',
  templateUrl: './register-supplier.component.html',
  styleUrls: ['./register-supplier.component.scss']
})
export class RegisterSupplierComponent implements OnInit {
  
  form!: FormGroup;
  formAddress!: FormGroup;
  formLegalRepresentative!: FormGroup;
  formLegalRepresentativeAddress!: FormGroup;
  formCategoryAndSegments!: FormGroup;
  isSubmit: boolean = false;
  categoriesAndSegments: CategoryResponseDto[] = [];
  selectCategoriesAndSegments: CategoryResponseDto[] = [];
  regex = /\b(\d)\1+\b/;
  regexCNPJ = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

  mainCPFValid: boolean;
  mainCNPJValid: boolean;

  btnSupplier: boolean = true;
  btnSupplierUser: boolean = false;

  endpoint: string;

  @ViewChild("addressnumber") inputNumber: ElementRef;
  @ViewChild("addressnumberlegal") inputNumberLegalRepresentative: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    private router: Router,
    private toastrService: ToastrService,
    private userService: UserService,
    private translate: TranslateService,
    private cepService: CepService,
    private nominatimService: NominatimService,
    private supplierService: SupplierService,
    private categoryService: CategoryService,
    private location: Location

  ) {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(50)]],
      mainCnpj: ["", [Validators.minLength(14)]],
      mainCpf: ["", [Validators.minLength(11)]],
      type: ["", [Validators.required]],
    });

    this.formAddress = this.formBuilder.group({
      zipCode: ["", [Validators.required, Validators.minLength(8)]],
      number: [""],
      publicPlace: ["", [Validators.required]],
      neighborhood: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      // latitude: ["", [Validators.required]],
      // longitude: ["", [Validators.required]],
      complement: [""],
      referencePoint: [""],
    });

    this.formLegalRepresentative = this.formBuilder.group({
      name: ["", [Validators.required]],
      nationality: ["", [Validators.required]],
      maritalStatus: ["", [Validators.required]],
      cpf: ["", [Validators.required, Validators.minLength(11)]],
 /*      rg: ['', [Validators.required, this.rgValidator()]],
      document_origin: ["", [Validators.required, Validators.pattern(/^[A-Za-z/]+$/)]],
      validityData: ["", [Validators.required, this.dateValidator]], */
    });

    this.formLegalRepresentativeAddress = this.formBuilder.group({
      zipCode: ["", [Validators.required, Validators.minLength(8)]],
      number: [""],
      publicPlace: ["", [Validators.required]],
      neighborhood: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      complement: [""],
      referencePoint: [""],
    });

    this.formCategoryAndSegments = this.formBuilder.group({
      categories: [""],
    });

  }

  ngOnInit(): void {
    
    const url = this.location.path(); // Obtenemos la URL completa
    const partes = url.split('/'); // Dividimos la URL en segmentos usando "/"
    this.endpoint = partes.pop();    

    this.categoryService.getCategoryWithoutAuth().subscribe(response => {
      this.categoriesAndSegments = response;      
    });
  }  

  validCnpj() {
    this.mainCNPJValid =  UserDataValidator.validarCNPJ(this.form.controls["mainCnpj"].value)
  }
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

  confirm() {

    this.isSubmit = true;
    if (this.formLegalRepresentative.valid) {
    }
    const documentType = this.form.controls["type"].value;
    if (!documentType) return;

    if (documentType === "cnpj") {
      this.form.controls["mainCnpj"].addValidators([Validators.required, Validators.maxLength(14)]);
      this.form.controls["mainCpf"].clearValidators();
    } else {
      this.form.controls["mainCpf"].addValidators([Validators.required, Validators.maxLength(11)]);
      this.form.controls["mainCnpj"].clearValidators();
    }

    this.form.controls["mainCpf"].updateValueAndValidity();
    this.form.controls["mainCnpj"].updateValueAndValidity();

    if (this.form.invalid) {
      this.getErrosForm(this.form);
      return;
    }

    if(!this.selectCategoriesAndSegments.length){
      return;
    }

    if (this.formAddress.invalid || this.formLegalRepresentative.invalid || this.formLegalRepresentativeAddress.invalid){
      this.getErrosForm(this.formAddress);
      this.getErrosForm(this.formLegalRepresentative);
      this.getErrosForm(this.formLegalRepresentativeAddress);
      return;
    }

    const document = this.form.controls["mainCnpj"]?.value
      ? this.form.controls["mainCnpj"]?.value
      : this.form.controls["mainCpf"]?.value;

    if (!document) return;

    const newSupplier: SupplierRegisterDto = {
      name: this.form.controls["name"].value,
      cpf: document,
      type: this.form.controls["type"].value === "cpf" ? "pessoa_fisica" : "pessoa_juridica",
      group_id: this.formCategoryAndSegments.controls["categories"].value,
      address: new AddressDto(),
      legal_representative: new LegalRepresentativeDto(),
      categoriesId: this.selectCategoriesAndSegments?.map(category => category._id || "") || [],
    };

    newSupplier.address.city = this.formAddress.controls["city"].value;
    newSupplier.address.complement = this.formAddress.controls["complement"].value;
    // newSupplier.address.latitude = this.formAddress.controls["latitude"].value;
    // newSupplier.address.longitude = this.formAddress.controls["longitude"].value;
    newSupplier.address.neighborhood = this.formAddress.controls["neighborhood"].value;
    newSupplier.address.number = this.formAddress.controls["number"].value ?? 'S/N';
    newSupplier.address.publicPlace = this.formAddress.controls["publicPlace"].value;
    newSupplier.address.referencePoint = this.formAddress.controls["referencePoint"].value;
    newSupplier.address.state = this.formAddress.controls["state"].value;
    newSupplier.address.zipCode = this.formAddress.controls["zipCode"].value;

    newSupplier.legal_representative.name = this.formLegalRepresentative.controls["name"].value;
    newSupplier.legal_representative.nationality = this.formLegalRepresentative.controls["nationality"].value;
    newSupplier.legal_representative.maritalStatus = this.formLegalRepresentative.controls["maritalStatus"].value;
    newSupplier.legal_representative.cpf = this.formLegalRepresentative.controls["cpf"].value;
/*     newSupplier.legal_representative.rg = this.formLegalRepresentative.controls["rg"].value;
    newSupplier.legal_representative.document_origin = this.formLegalRepresentative.controls["document_origin"].value;
    newSupplier.legal_representative.validityData = this.formLegalRepresentative.controls["validityData"].value; */

    newSupplier.legal_representative.address = new AddressDto();
    newSupplier.legal_representative.address.complement =
      this.formLegalRepresentativeAddress.controls["complement"].value;
    newSupplier.legal_representative.address.city = this.formLegalRepresentativeAddress.controls["city"].value;
    newSupplier.legal_representative.address.neighborhood =
      this.formLegalRepresentativeAddress.controls["neighborhood"].value;
    newSupplier.legal_representative.address.number = this.formLegalRepresentativeAddress.controls["number"].value ?? 'S/N';
    newSupplier.legal_representative.address.publicPlace =
      this.formLegalRepresentativeAddress.controls["publicPlace"].value;
    newSupplier.legal_representative.address.referencePoint =
      this.formLegalRepresentativeAddress.controls["referencePoint"].value;
    newSupplier.legal_representative.address.state = this.formLegalRepresentativeAddress.controls["state"].value;
    newSupplier.legal_representative.address.zipCode = this.formLegalRepresentativeAddress.controls["zipCode"].value;


    this.supplierService.registerWithoutAuth(newSupplier).subscribe({
      next: async success => {
        
        await this.toastrService.success(this.translate.instant("TOASTRS.SUCCESS_CREATE_SUPPLIER"), "", {
          progressBar: true,
        });

        this.isSubmit = false;
        //await this.setInputValue()
        this.form.reset();
        this.formAddress.reset();
        this.formLegalRepresentative.reset();
        this.formLegalRepresentativeAddress.reset();
        this.formCategoryAndSegments.reset();        
        this.selectCategoriesAndSegments.splice(0, this.selectCategoriesAndSegments.length);
        
      },
      error: error => {
        this.toastrService.success(this.translate.instant("TOASTRS.ERROR_CREATE_SUPPLIER"), "", { progressBar: true });
      },
    });
  }

  handleCategories() {    
    if (this.formCategoryAndSegments.controls["categories"].value) {
      const selected = this.categoriesAndSegments.find(
        a => a._id?.toString() === this.formCategoryAndSegments.controls["categories"].value
      );

      const repeated = this.selectCategoriesAndSegments.filter(obj => obj.category_name == selected.category_name && obj.segment == selected.segment );
      if(!repeated.length){
        this.selectCategoriesAndSegments.push(selected!);  
      }
            
    }
  }

  removeCategory(index: number) {
    this.selectCategoriesAndSegments.splice(index, 1);
  }

  async searchSupplierAddressByCep(event: any) {
    if (event.target.value) {
      let cep: string = event.target.value.replace(".", "");
      cep = cep.replace("-", "");

      if (cep.length === 8) {
        const response = await this.cepService.buscarCep(cep);
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
    const address = { ...this.formAddress.value };

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
    const cpfControl = this.form.controls['mainCpf'];

    return cpfControl.dirty && !this.validarCPF(cpfControl.value);
  };
  maxDate(): string {
    const currentDate = new Date();
    const threeYearsLater = new Date(currentDate.getFullYear() + 20, currentDate.getMonth(), currentDate.getDate());
    return threeYearsLater.toISOString().split('T')[0];
  }


  isCPFInvalidAndTouchedRepresentative(): boolean {
    const cpfControl = this.formLegalRepresentative.controls['cpf'];

    return cpfControl.dirty && !this.validarCPF(cpfControl.value);
  };

  getErrosForm(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const controlErrors: ValidationErrors = form.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log("Key control: " + key + ", keyError: " + keyError + ", err value: ", controlErrors[keyError]);
        });
      }
    });
  }

  onSupplier(): void{    
    if(this.endpoint != "register-supplier"){
      this.btnSupplier = true;
      this.btnSupplierUser = false;
      this.router.navigate(['/accounts/register-supplier']);
    }    
  }

  onSupplierUser(): void{
    if(this.endpoint != "register-supplier-user"){
      this.btnSupplierUser = true;
      this.btnSupplier = false;
      this.router.navigate(['/accounts/register-supplier-user']);
    }    
  }

}