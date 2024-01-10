import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';
import { SupplierService } from '../../../../services/supplier.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-fornecedor',
  templateUrl: './delete-fornecedor.component.html',
  styleUrls: ['./delete-fornecedor.component.scss']
})
export class DeleteFornecedorComponent implements OnInit {

  @Input() fornecedor!: any;
  @Output() excluirFornecedor: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private toastrService: ToastrService,
    private ngbModal: NgbModal,
    public activeModal: NgbActiveModal,
    private translate: TranslateService,
    public _supplierService: SupplierService,
  ) { }

  ngOnInit(): void {
    let cancel = document.getElementById('cancel');
    cancel?.focus();
  }

  deleteFornecedor() {
    this.deleteSupplierById();
    this.activeModal.close();
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  async deleteSupplierById(): Promise<void> {
    await this._supplierService.deleteById(this.fornecedor._id).subscribe((response: any) => {
      if (response.success) this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_DELETE_SUPPLIER'), '', { progressBar: true });
    });

  }
}
