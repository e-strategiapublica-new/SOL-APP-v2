import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { DatamockService } from 'src/services/datamock.service';

@Component({
  selector: 'app-fornecedor-signed-contrato',
  templateUrl: './fornecedor-signed-contrato.component.html',
  styleUrls: ['./fornecedor-signed-contrato.component.scss']
})
export class FornecedorSignedContratoComponent {
  licitacoesList!: any[];
  currentPage: number = 1;
  itensPerPage: number = 6;
  searchTool = false;
  constructor(
    private datamockService: DatamockService,
    private authbase: AuthService,
    
    private router: Router
  ) {
  }

  ngOnInit(): void{
    this.licitacoesList = this.datamockService.licitacoes;
    if(this.authbase.getAuthenticatedUser().type !== 'fornecedor') this.router.navigate(['/pages/dashboard']);
  }

  toolSearch(){
    this.searchTool = !this.searchTool
  }

  detailBids(i: any){
    this.router.navigate(['/pages/fornecedor/detalhes-licitacoes']);
    localStorage.setItem('licitacao', JSON.stringify(i));
  }



}
