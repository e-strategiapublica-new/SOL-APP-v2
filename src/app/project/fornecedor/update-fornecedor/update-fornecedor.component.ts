import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { catchError, forkJoin, of } from "rxjs";
import { CepResponseDto } from "src/dtos/address/cep-response.dto";
import { CategoryResponseDto } from "src/dtos/category/category-response.dto";
import { SupplierRegisterDto } from "src/dtos/supplier/supplier-register-request.dto";
import { CategoryService } from "src/services/category.service";
import { CepService } from "src/services/cep.service";
import { NominatimService } from "src/services/nominatim.service";
import { SupplierService } from "src/services/supplier.service";
import UserDataValidator from "src/utils/user-data-validator.utils";

@Component({
  selector: "app-update-fornecedor",
  templateUrl: "./update-fornecedor.component.html",
  styleUrls: ["./update-fornecedor.component.scss"],
})
export class UpdateFornecedorComponent {
  form!: FormGroup;
  formAddress!: FormGroup;
  formLegalRepresentative!: FormGroup;
  formLegalRepresentativeAddress!: FormGroup;
  isSubmit: boolean = false;
  associationId!: string;
  fornecedor!: any | undefined;
  formCategoryAndSegments!: FormGroup;
  categoriesAndSegments: any[] = [];
  selectCategoriesAndSegments: CategoryResponseDto[] = [];
  regex =  /\b(\d)\1+\b/
  validCnpj: boolean = true

  request: SupplierRegisterDto;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private translate: TranslateService,

    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private categoryService: CategoryService,
    private cepService: CepService,
    private nominatimService: NominatimService
  ) {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(50)]],
      cnpj: ["", [Validators.minLength(14)]],
      cpf: ["", [Validators.minLength(11)]],
    });

    this.formAddress = this.formBuilder.group({
      zipCode: ["", [Validators.required, Validators.minLength(8)]],
      numberAddress: ["", [Validators.required]],
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
 /*      rg: ["", [Validators.required]],
      document_origin: ["", [Validators.required]],
      validityData: ["", [Validators.required, this.dateValidator]], */
    });

    this.formLegalRepresentativeAddress = this.formBuilder.group({
      zipCode: ["", [Validators.required, Validators.minLength(8)]],
      numberAddress: ["", [Validators.required]],
      publicPlace: ["", [Validators.required]],
      neighborhood: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      latitude: ["", [Validators.required]],
      longitude: ["", [Validators.required]],
      complement: [""],
      referencePoint: [""],
    });

    this.formCategoryAndSegments = this.formBuilder.group({
      categories: [""],
    });
  }
  converterDataParaInput(dataBackend: string): string {
    const data = new Date(dataBackend);
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
  ngOnInit(): void {
    const fornecedorId = this.route.snapshot.paramMap.get("id");
    if (fornecedorId) {
      const fork = forkJoin({
        fornecedor: this.supplierService.getById(fornecedorId).pipe(
          catchError(error => {
            this.toastrService.error(error.error);
            return of(undefined);
          })
        ),
        categories: this.categoryService.getCategory().pipe(
          catchError(error => {
            this.toastrService.error(error.error);
            return of(undefined);
          })
        ),
      });
      fork.subscribe({
        next: response => {
          this.fornecedor = response.fornecedor;
          this.categoriesAndSegments = response.categories;
          this.selectCategoriesAndSegments = this.categoriesAndSegments.filter(category => {
            return this.fornecedor.categories.some((categoryFornecedor: any) => {
              return categoryFornecedor._id === category._id;
            });
          });
          this.handlerInitForm();
        },
      });
    }

    this.formAddress.controls["zipCode"].valueChanges.subscribe({
      next: data => {
        if (data.length === 8) {
          this.insertDataForCep(data, "fornecedor");
        }
      },
    });

    this.formLegalRepresentativeAddress.controls["zipCode"].valueChanges.subscribe({
      next: data => {
        if (data.length === 8) {
          this.insertDataForCep(data, "representante");
        }
      },
    });
  }
  validateCnpj() {
    this.validCnpj = UserDataValidator.validarCNPJ(this.form.controls["cnpj"].value)
  }

  async insertDataForCep(cep: string, typeForm: string) {
    if (cep.length < 8) return

    if (typeForm === "fornecedor") {
      const response = await this.searchCep(cep);

      this.formAddress.patchValue({
        publicPlace: response.logradouro,
        neighborhood: response.bairro,
        city: response.cidade,
        state: response.uf,
        number: response.numero,
      });
      const result: any = await this.nominatimService.getLatLongByAddress(
        response.logradouro,
        response.cidade,
        'brazil',
        response.uf,
      );

      if (result.length > 0) {
        const lat = result[0].lat;
        const lon = result[0].lon;

        this.formAddress.patchValue({
          latitude: lat,
          longitude: lon,
        });
      } else {
        this.formAddress.patchValue({
          latitude: 1,
          longitude: 1,
        });
      }
    } else {
      const response = await this.searchCep(cep);
      this.formLegalRepresentativeAddress.patchValue({
        publicPlace: response.logradouro,
        neighborhood: response.bairro,
        city: response.cidade,
        state: response.uf,
        number: response.numero,
      });
      const result: any = await this.nominatimService.getLatLongByAddress(
        response.logradouro,
        response.cidade,
        'brazil',
        response.uf,
      );

      if (result.length > 0) {
        const lat = result[0].lat;
        const lon = result[0].lon;

        this.formLegalRepresentativeAddress.patchValue({
          latitude: lat,
          longitude: lon,
        });
      } else {
        this.formLegalRepresentativeAddress.patchValue({
          latitude: 1,
          longitude: 1,
        });
      }
    }
  }

  async searchCep(cep: string): Promise<CepResponseDto> {
    return await this.cepService.buscarCep(cep);
  }

  handlerInitForm() {
    this.form.patchValue({
      name: this.fornecedor?.name,
      cnpj: this.fornecedor?.cpf,
      cpf: this.fornecedor?.cpf,
    });

    this.formAddress.patchValue({
      zipCode: this.fornecedor?.address?.zipCode,
      publicPlace: this.fornecedor?.address?.publicPlace,
      numberAddress: this.fornecedor?.address?.number,
      neighborhood: this.fornecedor?.address?.neighborhood,
      city: this.fornecedor?.address?.city,
      state: this.fornecedor?.address?.state,
      // latitude: this.fornecedor?.address?.latitude,
      // longitude: this.fornecedor?.address?.longitude,
      complement: this.fornecedor?.address?.complement,
      referencePoint: this.fornecedor?.address?.referencePoint,
    });

    this.formLegalRepresentative.patchValue({
      name: this.fornecedor?.legal_representative?.name,
      nationality: this.fornecedor?.legal_representative?.nationality,
      maritalStatus: this.fornecedor?.legal_representative?.maritalStatus,
      cpf: this.fornecedor?.legal_representative?.cpf,
  /*     rg: this.fornecedor?.legal_representative?.rg,
      document_origin: this.fornecedor?.legal_representative?.document_origin,
      validityData: this.converterDataParaInput(this.fornecedor?.legal_representative?.validityData), */
    });

    this.formLegalRepresentativeAddress.patchValue({
      zipCode: this.fornecedor?.legal_representative?.address?.zipCode,
      numberAddress: this.fornecedor?.legal_representative?.address?.number,
      publicPlace: this.fornecedor?.legal_representative?.address?.publicPlace,
      neighborhood: this.fornecedor?.legal_representative?.address?.neighborhood,
      city: this.fornecedor?.legal_representative?.address?.city,
      state: this.fornecedor?.legal_representative?.address?.state,
      latitude: this.fornecedor?.legal_representative?.address?.latitude,
      longitude: this.fornecedor?.legal_representative?.address?.longitude,
      complement: this.fornecedor?.legal_representative?.address?.complement,
      referencePoint: this.fornecedor?.legal_representative?.address?.referencePoint,
    });
    const documentType = this.fornecedor.type;
    if (!documentType) return;
   
    if (documentType === "pessoa_juridica") {
      this.form.controls["cnpj"].addValidators([Validators.required]);
      this.form.controls["cpf"].clearValidators();
    } else {
      
      this.form.controls["cpf"].addValidators([Validators.required]);
      this.form.controls["cnpj"].clearValidators();
    }
    if (this.formAddress.invalid || this.formLegalRepresentative.invalid || this.formLegalRepresentativeAddress.invalid){
      this.getErrosForm(this.formAddress);
      this.getErrosForm(this.formLegalRepresentative);
      this.getErrosForm(this.formLegalRepresentativeAddress);
      return;
    }
  }

  salvarEdicao() {
    this.fornecedor!.name = this.form.value.name;
    this.fornecedor!.document = this.fornecedor.type === 'pessoa_fisica'? this.form.value.cpf : this.form.value.cnpj;
    this.fornecedor!.zip = this.formAddress.value.zipCode;
    this.fornecedor!.number = this.formAddress.value.numberAddress;
    this.fornecedor!.publicPlace = this.formAddress.value.publicPlace;
    this.fornecedor!.neighborhood = this.formAddress.value.neighborhood;
    this.fornecedor!.city = this.formAddress.value.city;
    this.fornecedor!.state = this.formAddress.value.state;
    // this.fornecedor!.latitude = this.formAddress.value.latitude;
    // this.fornecedor!.longitude = this.formAddress.value.longitude;
    this.fornecedor!.complement = this.formAddress.value.complement;
    this.fornecedor!.referencePoint = this.formAddress.value.referencePoint;
    this.fornecedor!.legalZip = this.formLegalRepresentativeAddress.value.zipCode;
    this.fornecedor!.legalNumber = this.formLegalRepresentativeAddress.value.numberAddress;
    this.fornecedor!.legalPublicPlace = this.formLegalRepresentativeAddress.value.publicPlace;
    this.fornecedor!.legalNeighborhood = this.formLegalRepresentativeAddress.value.neighborhood;
    this.fornecedor!.legalCity = this.formLegalRepresentativeAddress.value.city;
    this.fornecedor!.legalState = this.formLegalRepresentativeAddress.value.state;
    this.fornecedor!.legalLatitude = this.formLegalRepresentativeAddress.value.latitude;
    this.fornecedor!.legalLongitude = this.formLegalRepresentativeAddress.value.longitude;
    this.fornecedor!.legalComplement = this.formLegalRepresentativeAddress.value.complement;
    this.fornecedor!.legalReferencePoint = this.formLegalRepresentativeAddress.value.referencePoint;

    const categoriesId = this.selectCategoriesAndSegments
      ?.map(category => category._id || "")
      .filter(category => category !== "");

    this.request = {
      
      name: this.form.value.name,
      cpf: this.fornecedor.type === 'pessoa_fisica'? this.form.value.cpf : this.form.value.cnpj,
      address: {
        zipCode: this.formAddress.value.zipCode,
        number: this.formAddress.value.numberAddress,
        publicPlace: this.formAddress.value.publicPlace,
        neighborhood: this.formAddress.value.neighborhood,
        city: this.formAddress.value.city,
        state: this.formAddress.value.state,
        latitude: this.formAddress.value.latitude,
        longitude: this.formAddress.value.longitude,
        complement: this.formAddress.value.complement,
        referencePoint: this.formAddress.value.referencePoint,
      },
      legal_representative: {
        name: this.formLegalRepresentative.value.name,
        cpf: this.formLegalRepresentative.value.cpf,
        address: {
          zipCode: this.formLegalRepresentativeAddress.value.zipCode,
          number: this.formLegalRepresentativeAddress.value.numberAddress,
          publicPlace: this.formLegalRepresentativeAddress.value.publicPlace,
          neighborhood: this.formLegalRepresentativeAddress.value.neighborhood,
          city: this.formLegalRepresentativeAddress.value.city,
          state: this.formLegalRepresentativeAddress.value.state,
          latitude: this.formLegalRepresentativeAddress.value.latitude,
          longitude: this.formLegalRepresentativeAddress.value.longitude,
          complement: this.formLegalRepresentativeAddress.value.complement,
          referencePoint: this.formLegalRepresentativeAddress.value.referencePoint,
        },
        maritalStatus: this.formLegalRepresentative.value.maritalStatus,
/*         validityData: this.formLegalRepresentative.value.validityData,
        rg: this.formLegalRepresentative.value.rg,
        document_origin: this.formLegalRepresentative.value.document_origin, */
        nationality: this.formLegalRepresentative.value.nationality,
      },
      group_id: this.fornecedor?.group_id,
      type: this.fornecedor?.type,
      categoriesId: categoriesId,
    };

    this.supplierService.update(this.fornecedor?._id!, this.request).subscribe({
      next: response => {
        this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_EDIT_SUPPLIER'), '', { progressBar: true });
        this.router.navigate(["/pages/fornecedor"]);
      },
      error: error => {
        console.error(error);
        this.toastrService.error(this.translate.instant('TOASTRS.ERROR_EDIT_SUPPLIER'), '', { progressBar: true });
      },
    });
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

  onSubmit() { 
    this.isSubmit =true
    if (this.formLegalRepresentative.valid) {
    }
    if (this.form.invalid) {      
      this.getErrosForm(this.form);
      return;
    }
    
    this.salvarEdicao();
  }

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
    const cpfControl = this.form.controls['cpf'];

    return cpfControl.dirty && !this.validarCPF(cpfControl.value);
  };

  handleCategories() {
    if (this.formCategoryAndSegments.controls["categories"].value) {
      const selected = this.categoriesAndSegments.find(
        a => a._id?.toString() === this.formCategoryAndSegments.controls["categories"].value
      );
      this.selectCategoriesAndSegments.push(selected!);
    }
  }

  removeCategory(index: number) {
    this.selectCategoriesAndSegments.splice(index, 1);
  }

  cancel(){      
    localStorage.setItem('id_fornecedor','0');
    this.router.navigate(['/pages/fornecedor']);
  }


}
