import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AssociationBidService } from 'src/services/association-bid.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-recusar-licitacao',
  templateUrl: './recusar-licitacao.component.html',
  styleUrls: ['./recusar-licitacao.component.scss']
})
export class RecusarLicitacaoComponent implements OnInit {

  responseId: any;
  storedLanguage : string | null;
  reason: string;

  constructor(
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private bidService: AssociationBidService,
    private router: Router,
    private spinnerService: NgxSpinnerService
  ) { }
  ngOnInit(): void {
    let bid: any = localStorage.getItem('bidId');
    this.responseId = bid;

    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }
  closeModal(value: string) {
    this.modalService.dismissAll();
  }

  getReason(event: any) {
    this.reason = event.target.value;
  
  }

  confirm() {
    let request = {
      status: 'returned',
      declined_reason: this.reason
    }
    this.spinnerService.show();
    this.bidService.changeStatus(this.responseId, request).subscribe({
      next: data => {
        let successMessage = 'Recusada com sucesso';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Recusada com sucesso'
            break;
          case 'en':
            successMessage = 'successfully declined'
            break;
          case 'fr':
            successMessage = 'refusé avec succès'
            break;
          case 'es':
            successMessage = 'rechazado con éxito'
            break;
        }

        const toastr = this.toastrService.success(successMessage, '', { progressBar: true });
        if (toastr) {
          toastr.onHidden.subscribe(() => {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            this.router.navigate(['/pages/licitacoes'])
          });
        }
      },
      error: error => {
        this.spinnerService.hide();
        let errorMessage = 'Erro ao recusar licitação!';

        switch(this.storedLanguage) {
          case 'pt': 
            errorMessage = 'Erro ao recusar licitação!'
            break;
          case 'en':
            errorMessage = 'Error rejecting bid!'
            break;
          case 'fr':
            errorMessage = "Erreur lors du rejet de l'enchère !"
            break;
          case 'es':
            errorMessage = '¡Error al rechazar la oferta!'
            break;
        }

        this.toastrService.error('Erro ao recusar licitação!', '', { progressBar: true });
      }
    })
  }

  ngOnDestroy() {
    console.log("bid 2")
    localStorage.removeItem('bid')
  }
}
