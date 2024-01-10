import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteFornecedorComponent } from './delete-fornecedor/delete-fornecedor.component';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from '../../../services/supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import FilterFuzzy from 'src/utils/filterFuzzy.util';
import Fuse from 'fuse.js';
import { AuthService } from 'src/services/auth.service';
import { SupplierGetResponseDto } from 'src/dtos/supplier/supplier-get-response.dto';                                     


@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss']
})
export class FornecedorComponent {

  currentPage: number = 1;
  itensPerPage: number = 8;
  fornecedor: SupplierGetResponseDto[];
  fornecedorFilter: SupplierGetResponseDto[];
  form: FormGroup;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private ngbModal: NgbModal,
    private toastrService: ToastrService,
    private _supplierService: SupplierService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {

    const id = localStorage.getItem('id_fornecedor');
    if(id && id == '0'){      
      localStorage.removeItem('id_fornecedor')
      this.fornecedorFilter = this._supplierService.getFornecedorFilterList();
      this.fornecedor = this._supplierService.getFornecedorList();
    }else{
      this.list()  
    }
    
    this.form.controls['search'].valueChanges.subscribe((text: string) => {
      if (text) {
        //   this.fornecedor = this.fornecedor.filter((item: any) =>
        //   item.name.toLowerCase().includes(text) ||
        //   item.cpf.toLowerCase().includes(text) ||
        //   item.address.city.toLowerCase().includes(text)
        // );
        
        
        const name = this.fornecedor.filter(obj => ((obj.name).toLowerCase()).includes(text.toLowerCase()));
        const cpf = this.fornecedor.filter(obj => ((obj.cpf).toLowerCase()).includes(text.toLowerCase()));

        const array = [...name, ...cpf]
        const dataArr = new Set(array)
        const result = [...dataArr];                         

        this.fornecedorFilter = result

      }

      else
        this.fornecedorFilter = this.fornecedor
    });

    
  }

  list() {
    this._supplierService.supplierList().subscribe((response: any) => {
      this.fornecedor = response;
      this.fornecedorFilter = response

      this._supplierService.setFornecedorFilterList(response);
      this._supplierService.setFornecedorList(response);

    });
    
  }

  openModal(fornecedor: any) {
    const modalRef = this.ngbModal.open(DeleteFornecedorComponent, {
      centered: true,
      backdrop: true,
      size: 'md',
    });
    modalRef.componentInstance.fornecedor = fornecedor;
    modalRef.result.then(data => {
      this.list()
    }, error => {
      console.error('error', error);
    });
  }

  navigateToItem(id: string) {
    this.router.navigate(['/pages/fornecedor/dados-fornecedor/' + id]);
  }
}