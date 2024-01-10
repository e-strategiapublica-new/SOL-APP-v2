import { Component } from '@angular/core';
import { ConvenioResponseDto } from 'src/dtos/convenio/convenio-response.dto';
import { ConvenioService } from 'src/services/convenio.service';

@Component({
  selector: 'app-associacao-convenios',
  templateUrl: './associacao-convenios.component.html',
  styleUrls: ['./associacao-convenios.component.scss']
})
export class AssociacaoConveniosComponent {

  convenios: ConvenioResponseDto[] = [];

  constructor(
    private conveniosService: ConvenioService,
  ) {

  }

  ngOnInit(): void {
    this.conveniosService.getConvenioForAssociation().subscribe({
      next: data => {
        this.convenios = data;
      },
      error: error => {
        console.error(error)
      }
    })
  }

}
