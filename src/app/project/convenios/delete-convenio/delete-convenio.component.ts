import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConvenioResponseDto } from 'src/dtos/convenio/convenio-response.dto';
import { ConvenioService } from 'src/services/convenio.service';
import { LocalStorageService } from 'src/services/local-storage.service';

@Component({
  selector: 'app-delete-convenio',
  templateUrl: './delete-convenio.component.html',
  styleUrls: ['./delete-convenio.component.scss']
})
export class DeleteConvenioComponent implements OnInit {

  @Input() convenio: ConvenioResponseDto;


  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private ngbModal: NgbModal,
    private convenioService: ConvenioService,
  ) {
  }

  ngOnInit(): void {
  }

  deleteItem() {
    this.convenioService.deleteConvenio(this.convenio._id).subscribe({
      next: success => {
        this.toastrService.success('Exluido com sucesso!', '', { progressBar: true });
        this.ngbModal.dismissAll();

      },
      error: error => {
        console.error(error);
        this.ngbModal.dismissAll();

        this.toastrService.error(error.error.errors[0], 'Error ao excluir!', { progressBar: true });
      }
    });
  }

  closeModal() {
    this.ngbModal.dismissAll();
  }

}
