import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatamockService } from 'src/services/datamock.service';
import { Location } from '@angular/common';
import { SupplierService } from 'src/services/supplier.service';
import { ProposalService } from 'src/services/proposal.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-fornecedor-enviar-proposta',
  templateUrl: './fornecedor-enviar-proposta.component.html',
  styleUrls: ['./fornecedor-enviar-proposta.component.scss']
})
export class FornecedorEnviarPropostaComponent {
  @ViewChild('fretealarm') fretealarm: ElementRef;
  @ViewChild('doc', { static: true }) fileInput: ElementRef<HTMLInputElement>;
  form: FormGroup;
  formItemValue: FormGroup;
  formGlobal: FormGroup;
  formDoc: FormGroup;
  notImage = true;
  docName: string;
  FRETEaLERT = 'Valor do frete'
  create: string;
  PDFaLERT = false;
  docs = false;
  docsINput = true;
  response: any;

  fornecedor: any;
  price: number[] = [];
  valorTotal: any;
  docForSend: any;

  totalValueProposal: number;

  constructor(
    public datamock: DatamockService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private toastrService: ToastrService,
    private location: Location,
    private proposalService: ProposalService
  ) {
    this.formDoc = this.formBuilder.group({
      doc: ['', [Validators.required]],
    });
    this.formGlobal = this.formBuilder.group({
      frete: ['', [Validators.required]],
      valueUnity: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {
    let response: any = localStorage.getItem('enviarproposta');
    this.response = JSON.parse(response);

    this.form = this.gerenateForm();

    this.formItemValue = this.gerenateFormItemValue();
    Object.assign(this.response, { enableBtn: false })

    if (this.response.typeSend === 'create') {
      this.create = 'create'
    } else {
      this.create = 'send'
    }

    this.getVerify()

  }

  getTotalValueAllotment(item: any) {

    for (let i = 0; i < item.add_item.length; i++) {
      if (this.formItemValue.controls[`value-${item._id}-position-${i}`].value !== null && this.formItemValue.controls[`value-${item._id}-position-${i}`].value !== 0) {
        item.Object.assign(item, { totalValue: Number(item.add_item[i].quantity) * Number(this.formItemValue.controls[`value-${item._id}-position-${i}`].value) })
      }
    }
    return 0
  }

  operation(event: any, item: any, idFake: any) {
    const value = this.formItemValue.controls[`value-${item._id}-position-${idFake}`].value
    for (let i = 0; i < this.response.add_allotment.length; i++) {
      for (let x = 0; x < this.response.add_allotment[i].add_item.length; x++) {
        if (x === idFake) {
          Object.assign(this.response.add_allotment[i].add_item[x], { totalValue: value * this.response.add_allotment[i].add_item[x].quantity })
        }
        this.calculateTotalValueAllotment(item);
      }
    }
  }

  calculateTotalValueAllotment(item: any) {
    let totalValueSum = 0;
    let allTotalValuesPresent = true;

    for (let iterator of this.response.add_allotment) {
      if (iterator._id === item._id) {
        for (let item of iterator.add_item) {
          if (item.totalValue === null || item.totalValue === undefined) {
            allTotalValuesPresent = false;
          }
          totalValueSum += item.totalValue;
        }

        if (allTotalValuesPresent) {
          iterator = Object.assign(iterator, { totalValue: totalValueSum });
        }
      }
    }
    // const teste = this.response.add_allotment.filter((el: any) => el.totalValue && el.totalValue !== null)
    // if (teste.length === this.response.add_allotment) {
    //   Object.assign(this.response, { enableBtn: true })
    // }
    let teste: any = [];
    for (let iterator of this.response.add_allotment) {
      if (iterator.totalValue) {
        teste.push(iterator)
      }
    }
    if (teste.length === this.response.add_allotment.length) {
      Object.assign(this.response, { enableBtn: true })
    }

  }


  getVerify() {
    for (let iterator of this.response.add_allotment) {
      this.proposalService.getProposalVerify(iterator._id).subscribe({
        next: data => {
          if (data === true) {
            iterator = Object.assign(iterator, { disabledBtn: true })
          }
        }
      });
    }
  }

  getValueTotalGlobal() {
    let teste = this.response.add_allotment.reduce((ac: number, item: any) => ac + item.totalValue, 0);
    return teste
  }

  gerenateForm() {
    const formGroup: { [key: string]: any } = {};

    for (let i = 0; i < this.response.add_allotment.length; i++) {
      const controlNameFrete = 'frete-' + `${this.response.add_allotment[i]._id}`;
      const controlNameTotalValue = 'totalValue-' + `${this.response.add_allotment[i]._id}`;
      formGroup[controlNameFrete] = ['', [Validators.required]],
        formGroup[controlNameTotalValue] = ['', [Validators.required]]
    }

    return this.formBuilder.group(formGroup)

  }

  gerenateFormItemValue() {
    const formGroup: { [key: string]: any } = {};

    for (let i = 0; i < this.response.add_allotment.length; i++) {
      for (let x = 0; x < this.response.add_allotment[i].add_item.length; x++) {
        const controlNameValue = 'value-' + `${this.response.add_allotment[i]._id}` + `-position-` + x;
        formGroup[controlNameValue] = [[''], [Validators.required]]
      }
    }

    return this.formBuilder.group(formGroup)

  }

  submitTeste() {

  }

  getTotalValueProposal(allotmentId: string) {
    const allotmentArr = this.response.add_allotment.find((a: any) => a._id === allotmentId);

    return allotmentArr.totalValue
  }

  backProposal() {
    if (this.form.controls['frete'].value === '' || this.form.controls['frete'].value === null) {
      this.fretealarm.nativeElement.classList.add("border-danger", "border", "text-danger");
      this.FRETEaLERT = 'Valor do frete necessário'
      setInterval(() => {
        this.fretealarm.nativeElement.classList.remove("border-danger", "border", "text-danger");
        this.FRETEaLERT = 'Valor do frete'
      }, 3000);
    } else {
      this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_UPDATE'), '', { progressBar: true });
      this.location.back();
    }
  }

  backProposalDetail() {
    this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_SEND'), '', { progressBar: true });
    this.location.back();
  }

  confirm(allotmentId: string) {

    if (this.response.typeSend === 'create') {
      let request: any
      if (this.response.bid_type !== 'globalPrice') {
        request = {
          total_value: this.getTotalValueProposal(allotmentId),
          licitacaoId: this.response._id,
          allotmentIds: [allotmentId],
          freight: this.form.controls['frete-' + allotmentId].value
        }
      } else {
        let teste: any = [];
        for (let iterator of this.response.add_allotment) {
          teste.push({ allotmentId: iterator._id, totalValue: iterator.totalValue })
        }
        request = {
          total_value: this.getValueTotalGlobal(),
          licitacaoId: this.response._id,
          allotmentIds: this.response.add_allotment,
          freight: this.formGlobal.controls['frete'].value,
          totalValueForAllotment: teste
        }
      }



      this.proposalService.register(request).subscribe({
        next: data => {
          this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_PROPOSAL'), '', { progressBar: true });
          for (let iterator of this.response.add_allotment) {
            if (iterator._id === allotmentId) {
              iterator = Object.assign(iterator, { disabledBtn: true })
            }
          }
        },
        error: error => {
          this.toastrService.error(this.translate.instant('TOASTRS.ERROR_PROPOSAL'), '', { progressBar: true });
          console.error(error)
        }
      })

    } else {
      let request = {
        file: this.docForSend,
        licitacaoId: this.response._id,
        allotmentIds: this.response.add_allotment[0]._id
      }

      this.proposalService.register(request).subscribe({
        next: data => {
          this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_PROPOSAL'), '', { progressBar: true });
          this.location.back();
        },
        error: error => {
          this.toastrService.error(this.translate.instant('TOASTRS.ERROR_PROPOSAL'), '', { progressBar: true });
          console.error(error)
        }
      })
    }




  }


  deleteDoc() {
    this.docName = '';
    if (this.fileInput) this.fileInput.nativeElement.value = '';
    this.docs = false;
    this.docsINput = true;
  }


  download() {
    this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_DOWNLOAD'), '', { progressBar: true });
  }

  fileSelected(event: any) {
    const doc: File = event.target.files[0];
    const pdf = /(\.pdf)$/i;
    this.docs = true;
    this.docName = doc.name
    this.docsINput = false;
    this.readFile(doc);
  }

  readFile(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const contents = e.target.result;
      this.convertToBase64(contents);
    };

    reader.readAsBinaryString(file);
  }

  convertToBase64(contents: string) {
    const base64 = btoa(contents);
    this.docForSend = base64;
  }
  criarItem(item: any, ii: any) {
    let resultado = 0;
    let objeto = this.response.add_allotment[ii]
    for (let i = 0; i < objeto.add_item.length; i++) {
      let item = objeto.add_item[i];
      if (item.value && item.quantity) {
        resultado += item.value * item.quantity;
      }
    }
    this.form.controls[`totalValue-${objeto._id}`].setValue(resultado)
  }

}
