import { Component } from '@angular/core';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent {
  situationWaiting: boolean = true;
  situationWaitingSupplier: boolean = false;
  situationDone: boolean = false;
}
