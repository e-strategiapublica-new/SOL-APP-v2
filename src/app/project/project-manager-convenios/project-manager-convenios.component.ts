import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConvenioResponseDto } from 'src/dtos/convenio/convenio-response.dto';
import { AuthService } from 'src/services/auth.service';
import { ConvenioService } from 'src/services/convenio.service';

@Component({
  selector: 'app-project-manager-convenios',
  templateUrl: './project-manager-convenios.component.html',
  styleUrls: ['./project-manager-convenios.component.scss']
})
export class ProjectManagerConveniosComponent implements OnInit {
  currentPage: number = 1;
  itensPerPage: number = 8;

  convenios: ConvenioResponseDto[] = [];
  userId: string = '';

  constructor(
    private conveniosService: ConvenioService,
    private authbase: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userId = this.authbase.getAuthenticatedUser().id;
    this.conveniosService.getConvenio().subscribe({
      next: data => {
        this.convenios = data.filter((item: any) => item.manager !== undefined).filter((ele: any) => ele.manager._id === this.userId);
      },
      error: error => {
        console.error(error)
      }
    })
  }

  detalheConvenios(item: ConvenioResponseDto) {
    this.router.navigate(["pages/convenios/detalhes-convenio/" + item._id]);
  }

}
