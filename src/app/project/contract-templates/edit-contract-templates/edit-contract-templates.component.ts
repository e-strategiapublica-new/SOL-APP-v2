import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ModelContractDto } from 'src/dtos/model-contract/model-contract.copy';
import { LanguageContractEnum } from 'src/enums/language-contract.enum';
import { ModelContractClassificationEnum } from 'src/enums/modelContract-classification.enum';
import { AssociationBidService } from 'src/services/association-bid.service';
import { ModelContractService } from 'src/services/model-contract.service';

@Component({
  selector: 'app-edit-contract-templates',
  templateUrl: './edit-contract-templates.component.html',
  styleUrls: ['./edit-contract-templates.component.scss']
})
export class EditContractTemplatesComponent {

  fileToUpload: any;
  modelContractClassificationEnum = ModelContractClassificationEnum;
  form: FormGroup;
  templateList!: ModelContractDto;
  languageContractEnum = LanguageContractEnum;
  licitacoesList: any = [];
  modelContractId!: string;
  isSectionOpenFornecedor: boolean = false;
  isSectionOpenAssociacao: boolean = false;
  isSectionOpenContrato: boolean = false;
  isSectionOpenConvenio: boolean = false;
  isSectionOpenLicitacao: boolean = false;
  isSectionOpenLote: boolean = false;
  isSectionOutros: boolean = false;
  htmlContent = '';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  
  storedLanguage: string | null

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ngxSpinnerService: NgxSpinnerService,
    private _modelContractService: ModelContractService,
    private activatedRoute: ActivatedRoute,
    private _associationBidService: AssociationBidService,
    private toastrService: ToastrService,
  ) {
    this.form = this.formBuilder.group({
      _id: '',
      name: '',
      classification: '',
      contract: '',
      language: ''
    })
  }

  ngOnInit(): void {

    this.ngxSpinnerService.show();
    this.activatedRoute.params.subscribe((params) => {
      this._modelContractService.getById(params['_id']).subscribe({
        next: (success) => {
          this.modelContractId = success._id;
          this.form.patchValue({
            _id: success._id,
            name: success.name,
            classification: success.classification,
            contract: success.contract
          });
        }
      })
    })

    this.ngxSpinnerService.hide();

    this.storedLanguage = localStorage.getItem('selectedLanguage');

  }

  onSubmit() {

    if(!this.form.value.classification || !this.form.value.language || !this.fileToUpload){
      this.toastrService.error('Preencha todos os campos obrigatórios!', '', { progressBar: true });
      return;
    }

    let dto = {
      name: this.form.value.name,
      classification: this.form.value.classification,
      contract: this.form.value.contract,
      language: this.form.value.language
    }

    const formData = new FormData();
    formData.append("name", this.form.value.name);
    formData.append("classification", this.form.value.classification);
    formData.append("contract", this.form.value.contract);
    formData.append("language", this.form.value.language);
    formData.append("file", this.fileToUpload);


    this._modelContractService.updateModelContract(this.modelContractId, formData).subscribe({
      next: (success) => {

        let successMessage = 'Modelo de documento atualizado com sucesso!';

        switch (this.storedLanguage) {
          case 'pt':
            successMessage = 'Modelo de documento atualizado com sucesso!'
            break;
          case 'en':
            successMessage = 'Document template successfully updated!'
            break;
          case 'fr':
            successMessage = 'Modèle de document mis à jour avec succès !'
            break;
          case 'es':
            successMessage = '¡Modelo de documento actualizada con éxito!'
            break;
        }

        this.toastrService.success(successMessage, '', { progressBar: true });
        this.router.navigate(['/pages/modelo-contratos'])
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });
  }

  toggleSectionFornecedor() {
    this.isSectionOpenFornecedor = !this.isSectionOpenFornecedor
  }

  toggleSectionAssociacao() {
    this.isSectionOpenAssociacao = !this.isSectionOpenAssociacao
  }

  toggleSectionContrato() {
    this.isSectionOpenContrato = !this.isSectionOpenContrato
  }

  toggleSectionConvenio() {
    this.isSectionOpenConvenio = !this.isSectionOpenConvenio
  }

  toggleSectionLicitacao() {
    this.isSectionOpenLicitacao = !this.isSectionOpenLicitacao
  }

  toggleSectionLote() {
    this.isSectionOpenLote = !this.isSectionOpenLote
  }
  
  toggleSectionOutros() {
    this.isSectionOutros = !this.isSectionOutros
  }

  backContact() {
    localStorage.setItem('id_modelo','0');
    this.router.navigate(['/pages/modelo-contratos']) 
  }

  onFileSelected(event: any ) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileToUpload = file;
    }
  }

}
