import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DatamockService } from 'src/services/datamock.service';

@Component({
  selector: 'app-cancelar-licitacao',
  templateUrl: './cancelar-licitacao.component.html',
  styleUrls: ['./cancelar-licitacao.component.scss']
})
export class CancelarLicitacaoComponent implements OnInit {

  storedLanguage : string | null;

  constructor(
    public datamock: DatamockService,
    private modalService: NgbModal,
    private toastrService: ToastrService,

  ) { }
  ngOnInit(): void {
    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }

  closeModal(value: string) {
    this.modalService.dismissAll();
    if (value === 'cancel') {

      let successMessage = 'Cancelado com sucesso!';

      switch(this.storedLanguage) {
        case 'pt': 
          successMessage = 'Cancelado com sucesso!'
          break;
        case 'en':
          successMessage = 'Canceled successfully!'
          break;
        case 'fr':
          successMessage = 'Annulé avec succès !'
          break;
        case 'es':
          successMessage = '¡Cancelado con éxito!'
          break;
      }
      
      this.toastrService.success('Cancelado com sucesso!', '', { progressBar: true });
    }
  }
}