import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContractResponseDto } from 'src/dtos/contratos/convenio-response.dto';
import { AuthService } from 'src/services/auth.service';
import { ContractsService } from 'src/services/contract.service';
import { DatamockService } from 'src/services/datamock.service';
import { jsPDF } from 'jspdf';
import { ContractInterface } from 'src/app/interface/contracts.interface';

@Component({
  selector: 'app-fornecedor-contrato',
  templateUrl: './fornecedor-contrato.component.html',
  styleUrls: ['./fornecedor-contrato.component.scss']
})
export class FornecedorContratoComponent {
  contratosList: ContractInterface[] = [];
  currentPage: number = 1;
  itensPerPage: number = 6;
  searchTool = false;
  constructor(
    private authbase: AuthService,
    private router: Router,
    private contractsService: ContractsService,
  ) {
  }

  ngOnInit(): void{
    this.contractsService.getContract().subscribe({
      next: data => {
        this.contratosList = data;
      },
      error: error => {
        console.error(error)
      }
    })
   
    /* this.contratosList = this.datamockService.contratos; */
    if(this.authbase.getAuthenticatedUser().type !== 'fornecedor') this.router.navigate(['/pages/dashboard']);
  }

  toolSearch(){
    this.searchTool = !this.searchTool
  }

  detailContract(i: any){
    this.router.navigate(['/pages/fornecedor/contratos/contrato-supplier/'+i._id]);
    /* localStorage.setItem('contrato', JSON.stringify(i)); */
  }
}
