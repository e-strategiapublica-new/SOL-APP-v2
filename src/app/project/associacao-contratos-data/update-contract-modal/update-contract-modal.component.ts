import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { ContractsService } from 'src/services/contract.service';
import { ContractUpdateStatusItemDto } from 'src/dtos/contratos/contract-update-register-request.dto';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-update-contract-modal',
  templateUrl: './update-contract-modal.component.html',
  styleUrls: ['./update-contract-modal.component.scss']
})
export class UpdateContractModalComponent {

  @Input() response: any;

  form: FormGroup;

  msg: string = '';

  executadoParcialmente: boolean = false;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private contractService: ContractsService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.form = this.formBuilder.group({
      newStatus: ['', [Validators.required]],
      items_received: [''],
      selectRadio: ''
    })
  }

  // ngOnInit(): void {
  //   console.log(this.response)
  //   this.form.controls['newStatus'].valueChanges.subscribe({
  //     next: data => {
  //       if (data === 'concluido') {
  //         this.msg = 'A situação “Concluído” indica que todos os itens foram entregues pelo fornecedor.'
  //       }

  //       if (data === 'executado_parcialmente') {
  //         this.msg = 'A situação “Executado parcialmente” indica que alguns itens não foram entregues pelo fornecedor.'
  //         this.executadoParcialmente = true;
  //       } else {
  //         this.executadoParcialmente = false;
  //       }

  //       if (data === 'inexecucao_total') {
  //         this.msg = 'A situação “Inexecução total” indica que nenhum item não foi entregue pelo fornecedor.'
  //       }
  //     }
  //   })
  // }

  ngOnInit(): void {
    this.form.controls['newStatus'].valueChanges.subscribe({
      next: data => {
        if (data === 'concluido') {
          this.msg = this.translate.instant('ASSOCIATION_CONTRACTS.COMPLETED_INDICATES');
        }

        if (data === 'executado_parcialmente') {
          this.msg = this.translate.instant('ASSOCIATION_CONTRACTS.PARTIALLY_EXECUTED_INDICATES');
          this.executadoParcialmente = true;
        } else {
          this.executadoParcialmente = false;
        }

        if (data === 'inexecucao_total') {
          this.msg = this.translate.instant('ASSOCIATION_CONTRACTS.TOTAL_NON_EXECUTION_INDICATES');
        }
      }
    });
  }

  exit() {
    this.modalService.dismissAll();
  }

  confirm() {
    if (this.form.controls['newStatus'].value === 'executado_parcialmente') {
      let quantity: number = 0;
      for (let iterator of this.response.proposal_id.allotment) {
        quantity = iterator.add_item.reduce((acc: number, item: any) => acc + Number(item.quantity), 0) + quantity;
      }
      if (Number(this.form.controls['items_received'].value) === quantity) {
        this.toastrService.error('O número de itens precisa ser menor que o total para considerar executado parcialmente', '', { progressBar: true })
      } else {
        let request = {
          status: 'executado_parcialmente',
          items_received: this.form.controls['items_received'].value
        }
        this.sendChanges(request);
      }
    }

    if (this.form.controls['newStatus'].value === 'concluido') {
      let request = {
        status: 'concluido'
      }

      this.sendChanges(request);

    }

    if (this.form.controls['newStatus'].value === 'inexecucao_total') {
      let request = {
        status: 'inexecucao_total',
        items_received: 0
      }
      this.sendChangesInexecucao(request);
    }
  }

  sendChanges(request: ContractUpdateStatusItemDto) {
    this.contractService.updateContract(this.response._id, request).subscribe({
      next: data => {
        this.toastrService.success('Contrado atualizado com sucesso', '', { progressBar: true });
        this.exit();
      },
      error: error => {
        this.toastrService.error('Erro ao editar contrato', '', { progressBar: true });
        console.error(error)
      }
    })
  }

  sendChangesInexecucao(request: ContractUpdateStatusItemDto) {
    this.contractService.updateContract(this.response._id, request).subscribe({
      next: data => {
        this.toastrService.success('Contrado atualizado com sucesso', '', { progressBar: true });
        this.exit();
        if (this.form.controls['selectRadio'].value === 'newBid') {
          localStorage.setItem('newBid', JSON.stringify(this.response.bid_number));
          this.router.navigate(['/licitacoes/licitacao-register']);
        }
        if (this.form.controls['selectRadio'].value === 'newProposal') {
          this.router.navigate(['/associacao/licitacoes/view-proposal/' + this.response.bid_number._id]);
        }
      },
      error: error => {
        this.toastrService.error('Erro ao editar contrato', '', { progressBar: true });
        console.error(error)
      }
    })
  }

  approve() {
    this.contractService
      .singAssociation(this.response?._id!, { status: "concluido", association_id: this.response?.association! })
      .subscribe({
        next: async success => {
          this.toastrService.success("Aceito com sucesso!", "", { progressBar: true });
        },
        error: async error => {
          this.toastrService.error("Erro ao aceitar", "", { progressBar: true });
        },
      });
  }

}
