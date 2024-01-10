import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProposalNotificationInterface } from 'src/app/interface/proposal-notification.interface';
import { ProposalService } from 'src/services/proposal.service';

@Component({
  selector: 'app-aceitar-proposta-modal',
  templateUrl: './aceitar-proposta-modal.component.html',
  styleUrls: ['./aceitar-proposta-modal.component.scss']
})
export class AceitarPropostaModalComponent {

  response: ProposalNotificationInterface;
  storedLanguage : string | null

  constructor(
    private modalService: NgbModal,
    private proposalService: ProposalService,
    private toastrService: ToastrService
  ) {
    
  }

  ngOnInit(): void {
    let response: any = localStorage.getItem('proposalAction');
    this.response = JSON.parse(response);

    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }

  confirm() {

    this.proposalService.acceptProposal(this.response._id).subscribe({
      next: data => {

        let successMessage = 'Proposta aceita com sucesso';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Proposta aceita com sucesso'
            break;
          case 'en':
            successMessage = 'Proposal successfully accepted'
            break;
          case 'fr':
            successMessage = 'Propuesta aceptada con éxito'
            break;
          case 'es':
            successMessage = 'Propuesta aceptada con éxito'
            break;
        }

        this.toastrService.success(successMessage, '', { progressBar: true });
        this.exit();
      },
      error: error => {

        let errorMessage = 'Erro ao aceitar proposta';

        switch(this.storedLanguage) {
          case 'pt': 
            errorMessage = 'Erro ao aceitar proposta'
            break;
          case 'en':
            errorMessage = 'Error accepting proposal'
            break;
          case 'fr':
            errorMessage = "Erreur lors de l'acceptation de la proposition"
            break;
          case 'es':
            errorMessage = 'Error al aceptar la propuesta'
            break;
        }

        console.error(error);
        this.toastrService.error(errorMessage, '', { progressBar: true })

      }
    })
  }

  exit() {
    this.modalService.dismissAll()
  }

  ngOnDestroy() {
    console.log("action 2")
    localStorage.removeItem('proposalAction')
  }

}
