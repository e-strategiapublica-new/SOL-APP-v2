import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { AssociationService } from 'src/services/association.service';
import { AuthService } from 'src/services/auth.service';
import { SupplierService } from 'src/services/supplier.service';

@Component({
  selector: 'app-supplier-data',
  templateUrl: './supplier-data.component.html',
  styleUrls: ['./supplier-data.component.scss']
})
export class SupplierDataComponent implements OnInit {

  fornecedor!: any | undefined;
  blockSupplier!: FormGroup;
  idSupplier!: boolean;

  constructor(
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private translate: TranslateService,
    private router: Router,
    private formBuilder: FormBuilder,
    private supplierService: SupplierService,
    private toatrService: ToastrService
  ) {
    this.blockSupplier = this.formBuilder.group({
      blocked_reason: [''],
    });
  }

  ngOnInit(): void {

    const fornecedorId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!fornecedorId) return;
    this.supplierService.getById(fornecedorId).subscribe({
      next: data => {
        this.fornecedor = data;
      },
      error: error => {
        console.error(error);
      }
    })
  }

  open(contentBlocked: any) {
    this.modalService.open(contentBlocked, { size: 'lg' });
  }

  openUnblockModal(contentUnBlocked: any) {
    this.modalService.open(contentUnBlocked, { size: 'lg' });
  }

  exit() {
    this.modalService.dismissAll();
  }

  handleBlock() {
    this.supplierService.block(this.fornecedor._id, this.blockSupplier.value).subscribe({
      next: data => {

        this.toatrService.success(this.translate.instant('TOASTRS.BLOCK_SUPPLIER'), '', { progressBar: true });
        this.modalService.dismissAll();
        this.blockSupplier.reset();
        this.ngOnInit();
      },
      error: error => {
        console.error(error)
      }
    })
  }

  handleUnBlock() {
    this.supplierService.unblock(this.fornecedor._id, this.blockSupplier.value).subscribe({
      next: data => {
        this.toatrService.success(this.translate.instant('TOASTRS.DESBLOCK_SUPPLIER'), '', { progressBar: true });
        this.modalService.dismissAll();
        this.blockSupplier.reset();
        this.ngOnInit();
      },
      error: error => {
        console.error(error)
      }
    })
  }

  cancel(){      
    localStorage.setItem('id_fornecedor','0');
    this.router.navigate(['/pages/fornecedor']);
  }

}
