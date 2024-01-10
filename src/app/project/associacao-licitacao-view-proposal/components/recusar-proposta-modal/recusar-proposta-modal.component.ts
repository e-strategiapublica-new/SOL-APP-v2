import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProposalNotificationInterface } from 'src/app/interface/proposal-notification.interface';
import { ProposalService } from 'src/services/proposal.service';

@Component({
  selector: 'app-recusar-proposta-modal',
  templateUrl: './recusar-proposta-modal.component.html',
  styleUrls: ['./recusar-proposta-modal.component.scss']
})
export class RecusarPropostaModalComponent {

  form: FormGroup;

  response: ProposalNotificationInterface;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private proposalService: ProposalService,
    private toastrService: ToastrService
  ) {
    this.form = this.formBuilder.group({
      refusedBecaused: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    let response: any = localStorage.getItem('proposalAction');
    this.response = JSON.parse(response);
  }

  confirm() {
    let request = {
      refusedBecaused: this.form.controls['refusedBecaused'].value,
      data : this.response
      
    }

    this.proposalService.refusedProposal(this.response._id, request, ).subscribe({

      next: data => {
        this.toastrService.success('Proposta recusada com sucesso', '', { progressBar: true });
        this.exit();
      },
      error: error => {
        console.error(error);
        this.toastrService.error('Erro ao recusar proposta', '', { progressBar: true })

      }
    })
  }

  exit() {
    this.modalService.dismissAll()
  }

  ngOnDestroy() {
    console.log("action")
    localStorage.removeItem('proposalAction')
  }

}
