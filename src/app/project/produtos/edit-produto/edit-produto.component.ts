import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductRequestDto } from 'src/dtos/product/product-request.dto';
import { LocalStorageService } from 'src/services/local-storage.service';
import { ProductService } from 'src/services/product.service';

@Component({
  selector: 'app-edit-produto',
  templateUrl: './edit-produto.component.html',
  styleUrls: ['./edit-produto.component.scss']
})
export class EditProdutoComponent implements OnInit {

  form: FormGroup;
  isSubmit: boolean = false;
  request: ProductRequestDto;

  constructor(
    private formBuilder: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    private productService: ProductService,
    public  localStorage: LocalStorageService,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      pdm: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {
    this.form.patchValue({
      name: this.localStorage.getDataProdutos().product_name,
      pdm: this.localStorage.getDataProdutos().pdm,
    });
  }
  onlyNumbersValidator() {
    const value = this.form.controls['pdm'].value.toString()
    const regex = /^[0-9]+$/;

    if (!regex.test(value)) {
      this.form.controls['pdm'].setValue(value.replace(/[^0-9]/g, ''));
    }
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.status == 'INVALID') {
      return;
    }
    this.request = {
      product_name: this.form.controls['name'].value,
      pdm: this.form.controls['pdm'].value.toString(),
    }
    this.productService.updateProduct(this.localStorage.getDataProdutos()._id, this.request).subscribe({
      next: (success) => {
        this.toastrService.success('Produto cadastrado com sucesso!', '', { progressBar: true });
        this.router.navigate(['/pages/produtos']);
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error('Error ao cadastrar o produto!', '', { progressBar: true });
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });
  }

  cancel(){      
    localStorage.setItem('id_product','0');
    this.router.navigate(['/pages/produtos']);  
  }

}

