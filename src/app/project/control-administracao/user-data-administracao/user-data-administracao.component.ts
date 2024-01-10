import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-user-data-administracao',
  templateUrl: './user-data-administracao.component.html',
  styleUrls: ['./user-data-administracao.component.scss']
})
export class UserDataAdministracaoComponent implements OnInit {

  user?: UserListResponseDto;

  constructor(
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {

    this.ngxSpinnerService.show();
    this.activatedRoute.params.subscribe((params) => {
      this.userService.getById(params['id']).subscribe({
        next: (success) => {
          this.user = success;
          this.ngxSpinnerService.hide();
        },
        error: (error) => {
          console.error(error);
          this.router.navigate(['/controle-admin']);
          this.ngxSpinnerService.hide();
        }
      });
    });

  }

  back(){      
    localStorage.setItem('id_user_admin','0');
    this.router.navigate(['/pages/controle-admin']);
  }

}
