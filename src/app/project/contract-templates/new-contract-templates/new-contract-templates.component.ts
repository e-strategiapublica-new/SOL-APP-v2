import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AssociationBidService } from "src/services/association-bid.service";
import { ModelContractService } from "src/services/model-contract.service";
import { AngularEditorConfig, AngularEditorModule } from "@kolkov/angular-editor";
import { LanguageContractEnum } from "src/enums/language-contract.enum";
import { ModelContractClassificationEnum } from "src/enums/modelContract-classification.enum";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-new-contract-templates",
  templateUrl: "./new-contract-templates.component.html",
  styleUrls: ["./new-contract-templates.component.scss"],
})
export class NewContractTemplatesComponent {
  fileToUpload: any;
  form: FormGroup;
  licitacoesList: any = [];
  isSectionOpenFornecedor: boolean = false;
  isSectionOpenAssociacao: boolean = false;
  isSectionOpenContrato: boolean = false;
  isSectionOpenConvenio: boolean = false;
  isSectionOpenLicitacao: boolean = false;
  isSectionOpenLote: boolean = false;
  languageContractEnum = LanguageContractEnum;
  modelContractClassificationEnum = ModelContractClassificationEnum;
  html: "";
  htmlContent = "";
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    toolbarHiddenButtons: [["bold"]],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
  };

  storedLanguage: string | null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _associationBidService: AssociationBidService,
    private _modelContractService: ModelContractService,
    private toastrService: ToastrService,
    private ngxSpinnerService: NgxSpinnerService
  ) {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required]],
      classification: [""],
      contract: [""],
      language: [""],
    });
  }

  ngOnInit(): void {
    this._associationBidService.list().subscribe({
      next: data => {
        this.licitacoesList = data;
      },
    });

    this.storedLanguage = localStorage.getItem("selectedLanguage");
  }

  onSubmit() {   
    
    if (!this.form.value.language || this.form.invalid || !this.fileToUpload) {
      let errorMessage = "Por favor, preencha todos os campos!";

      switch (this.storedLanguage) {
        case "pt":
          errorMessage = "Por favor, preencha todos os campos!";
          break;
        case "en":
          errorMessage = "Please fill in all fields!";
          break;
        case "fr":
          errorMessage = "Veuillez remplir tous les champs !";
          break;
        case "es":
          errorMessage = "Por favor, rellene todos los campos!";
          break;
      }

      this.toastrService.error(errorMessage, "", { progressBar: true });
      return;
    }

    let dto = {
      name: this.form.value.name,
      classification: this.form.value.classification,
      contract: this.form.value.contract,
      language: this.form.value.language,
    };

    this.ngxSpinnerService.show();

    const formData = new FormData();
    formData.append("name", this.form.value.name);
    formData.append("classification", this.form.value.classification);
    formData.append("contract", this.form.value.contract);
    formData.append("language", this.form.value.language);
    formData.append("file", this.fileToUpload);    

    this._modelContractService.modelContractRegister(formData).subscribe({
      next: success => {        

        this.ngxSpinnerService.hide();       

        let successMessage = "Modelo de contrato cadastrado com sucesso!";

        switch (this.storedLanguage) {
          case "pt":
            successMessage = "Modelo de contrato cadastrado com sucesso!";
            break;
          case "en":
            successMessage = "Contract template registered successfully!";
            break;
          case "fr":
            successMessage = "Modèle de contrat enregistré avec succès !";
            break;
          case "es":
            successMessage = "¡Plantilla de contrato registrada con éxito!";
            break;
        }

        this.toastrService.success(successMessage, "", { progressBar: true });        
        this.router.navigate(["/pages/modelo-contratos"]);
      },
      error: error => {
        this.ngxSpinnerService.hide();
        let errorMessage = "Erro ao cadastrar modelo de contrato!";

        switch (this.storedLanguage) {
          case "pt":
            errorMessage = "Erro ao cadastrar modelo de contrato!";
            break;
          case "en":
            errorMessage = "Error registering contract model!";
            break;
          case "fr":
            errorMessage = "Erreur lors de l'enregistrement du modèle de contrat!";
            break;
          case "es":
            errorMessage = "¡Error al registrar modelo de contrato!";
            break;
        }

        console.error(error);
        this.toastrService.error(errorMessage, "", { progressBar: true });
      },
    });
  }

  toggleSectionFornecedor() {
    if (this.isSectionOpenFornecedor) {
      this.isSectionOpenFornecedor = false;
    } else {
      this.isSectionOpenFornecedor = true;
    }
  }

  toggleSectionAssociacao() {
    if (this.isSectionOpenAssociacao) {
      this.isSectionOpenAssociacao = false;
    } else {
      this.isSectionOpenAssociacao = true;
    }
  }

  toggleSectionContrato() {
    if (this.isSectionOpenContrato) {
      this.isSectionOpenContrato = false;
    } else {
      this.isSectionOpenContrato = true;
    }
  }

  toggleSectionConvenio() {
    if (this.isSectionOpenConvenio) {
      this.isSectionOpenConvenio = false;
    } else {
      this.isSectionOpenConvenio = true;
    }
  }

  toggleSectionLicitacao() {
    if (this.isSectionOpenLicitacao) {
      this.isSectionOpenLicitacao = false;
    } else {
      this.isSectionOpenLicitacao = true;
    }
  }

  toggleSectionLote() {
    if (this.isSectionOpenLote) {
      this.isSectionOpenLote = false;
    } else {
      this.isSectionOpenLote = true;
    }
  }

  backContract() {
    this.router.navigate(["/pages/modelo-contratos"]);
  }

  onFileSelected(event: any ) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileToUpload = file;
    }
  }
}
