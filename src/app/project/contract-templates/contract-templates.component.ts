import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { ModelContractService } from "src/services/model-contract.service";
import { ModelContractDto } from "src/dtos/model-contract/model-contract.copy";
import * as moment from "moment";
import { LanguageContractEnum } from "src/enums/language-contract.enum";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import FilterFuzzy from "src/utils/filterFuzzy.util";
import Fuse from 'fuse.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-contract-templates",
  templateUrl: "./contract-templates.component.html",
  styleUrls: ["./contract-templates.component.scss"],
})
export class ContractTemplatesComponent {
  currentPage: number = 1;

  templateList!: ModelContractDto[];
  form: FormGroup
  secondTemplateList!: ModelContractDto[];
  constructor(
    private formBuilder: FormBuilder,
    private ngbModal: NgbModal,
    private router: Router,
    private _modelContractService: ModelContractService,
    private readonly ngxSpinnerService: NgxSpinnerService,
  ) {
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  ngOnInit(): void {
    
    const id = localStorage.getItem('id_modelo');
    if(id && id == '0'){      
      localStorage.removeItem('id_modelo')
      this.secondTemplateList = this._modelContractService.getTemplateFilterList();
      this.templateList = this._modelContractService.getTemplateList();
    }else{      
      this.ngxSpinnerService.show();      
      this.getContract()            
      this.ngxSpinnerService.hide(); 
    }    
    
    this.form.controls['search'].valueChanges.subscribe((text: string) => {
           
      if (text){        
         
        const name = this.templateList.filter(obj => ((obj.name).toLowerCase()).includes(text.toLowerCase()));
        const language = this.templateList.filter(obj => ((obj.language).toLowerCase()).includes(text.toLowerCase()));       

        const array = [...name, ...language]        
        const dataArr = new Set(array)
        const result = [...dataArr]; 
                  
        this.secondTemplateList = result
      }
      else
      this.secondTemplateList = this.templateList
    });
  }

  getContract() {
    this._modelContractService.list().subscribe({
      next: success => {
        for (let data of success) {
          data.createdAt = moment(success.createdAt).format("DD/MM/YYYY");
        }
        this.templateList = success;
        this.secondTemplateList = success;
        this._modelContractService.setTemplateFilterList(success);
        this._modelContractService.setTemplateList(success);
      },
    });
  }

  editContract(_id: string) {
    this.router.navigate([`pages/modelo-contratos/editar-modelo/${_id}`]);
  }


  //openModalDelete(item: ModelContractDto, _id:string) {
  //
  //  localStorage.setItem('editModelContracitems', JSON.stringify(item));

  //  const modal = this.ngbModal.open(DeleteContractTemplatesComponent, { centered: true, backdrop: true, size: 'md', keyboard: false })
  //  modal.result.then((result) => {
  //  }, err => {
  //    this.getContract();
  //  })
  //}

  handlerLanguage(lang: LanguageContractEnum) {
    switch (lang) {
      case LanguageContractEnum.portuguese:
        return "CREATE_BIDDING.SELECT_LANGUAGE_PORTUGUESE";
      case LanguageContractEnum.english:
        return "CREATE_BIDDING.SELECT_LANGUAGE_ENGLISH";
      case LanguageContractEnum.spanish:
        return "CREATE_BIDDING.SELECT_LANGUAGE_SPANISH";
      case LanguageContractEnum.french:
        return "CREATE_BIDDING.SELECT_LANGUAGE_FRENCH";
      default:
        return "--";
    }
  }
}
