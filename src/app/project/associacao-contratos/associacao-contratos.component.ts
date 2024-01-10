import { Component } from "@angular/core";
import { ContractsService } from "../../../services/contract.service";
import { AuthService } from "src/services/auth.service";

@Component({
  selector: "app-associacao-contratos",
  templateUrl: "./associacao-contratos.component.html",
  styleUrls: ["./associacao-contratos.component.scss"],
})
export class AssociacaoContratosComponent {

  contratos: any[] = [];
  userId: string = '';

  constructor(
    private _contractsService: ContractsService,
    private authbase: AuthService,
  ) { }

  ngOnInit(): void {
    if (this.authbase.getAuthenticatedUser().type == 'project_manager') {
      this.userId = this.authbase.getAuthenticatedUser().id;
      this._contractsService.getContract().subscribe({
        next: data => {

          this.contratos = data;
          const list = Object.values(data);
          this.contratos = list.filter((item: any) =>
            item.bid_number.agreement.manager === this.userId && item.bid_number.agreement.manager !== null
          );
        },
        error: error => {
          console.error(error);
        },
      });
    } else {
      this._contractsService.getContractByUserId(this.authbase.getAuthenticatedUser().id).subscribe({
        next: data => {
          console.log('data')
          this.contratos = data;
        },
        error: error => {
          console.error(error);
        },
      });
    }

  }
}
