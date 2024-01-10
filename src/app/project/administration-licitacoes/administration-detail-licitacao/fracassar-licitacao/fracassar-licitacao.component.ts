import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AssociationBidService } from 'src/services/association-bid.service';

@Component({
  selector: 'app-fracassar-licitacao',
  templateUrl: './fracassar-licitacao.component.html',
  styleUrls: ['./fracassar-licitacao.component.scss']
})
export class FracassarLicitacaoComponent implements OnInit {

  responseId: any;
  storedLanguage : string | null

  constructor(
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private bidService: AssociationBidService,
    private router: Router
  ) { }


  ngOnInit(): void {
    let bid: any = localStorage.getItem('bidId');
    this.responseId = bid;

    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }

  closeModal(value: string) {
    this.modalService.dismissAll();
    if (value === 'failbids') {

      let successMessage = 'Fracassado com sucesso!';

      switch(this.storedLanguage) {
        case 'pt': 
          successMessage = 'Fracassado com sucesso!'
          break;
        case 'en':
          successMessage = 'Failed successfully!'
          break;
        case 'fr':
          successMessage = 'Échec réussi !'
          break;
        case 'es':
          successMessage = '¡Error con éxito!'
          break;
      }

      this.toastrService.success(successMessage, '', { progressBar: true });
    }
  }

  confirm() {
    let request = {
      status: 'failed'
    }

    this.bidService.changeStatus(this.responseId, request).subscribe({
      next: data => {

        let successMessage = 'Fracassado com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Fracassado com sucesso!'
            break;
          case 'en':
            successMessage = 'Failed successfully!'
            break;
          case 'fr':
            successMessage = 'Échec réussi !'
            break;
          case 'es':
            successMessage = '¡Error con éxito!'
            break;
        }

        const toastr = this.toastrService.success(successMessage, '', { progressBar: true });
        if (toastr) {
          toastr.onHidden.subscribe(() => {
            this.modalService.dismissAll();
            this.router.navigate(['/pages/licitacoes'])
          });
        }
      },
      error: error => {

        let errorMessage = 'Erro ao fracassar licitação!';

        switch(this.storedLanguage) {
          case 'pt': 
            errorMessage = 'Erro ao fracassar licitação!'
            break;
          case 'en':
            errorMessage = 'Error failing bid!'
            break;
          case 'fr':
            errorMessage = "Erreur lors de l'échec de l'enchère !"
            break;
          case 'es':
            errorMessage = '¡Error al fallar la oferta!'
            break;
        }

        this.toastrService.error(errorMessage, '', { progressBar: true });
      }
    })
  }

  ngOnDestroy() {
    console.log("bid 3")
    localStorage.removeItem('bid')
  }
}
