import { Component } from '@angular/core';
import { ConvenioResponseDto } from 'src/dtos/convenio/convenio-response.dto';
import { AuthService } from 'src/services/auth.service';
import { ConvenioService } from 'src/services/convenio.service';

@Component({
  selector: 'app-administration-agreement-revisor',
  templateUrl: './administration-agreement-revisor.component.html',
  styleUrls: ['./administration-agreement-revisor.component.scss']
})
export class AdministrationAgreementRevisorComponent {

  convenios: ConvenioResponseDto[] = [];
  userId: string = '';

  constructor(
    private conveniosService: ConvenioService,
    private authbase: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.userId = this.authbase.getAuthenticatedUser().id;
    this.conveniosService.getConvenio().subscribe({
      next: data => {
        this.convenios = data.filter((item: any) => item.reviewer?._id === this.userId);
      },
      error: error => {
        console.error(error)
      }
    })
  }

}
