import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-user-data-associacao',
  templateUrl: './user-data-associacao.component.html',
  styleUrls: ['./user-data-associacao.component.scss']
})
export class UserDataAssociacaoComponent implements OnInit {

  user?: UserListResponseDto;

  constructor(
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

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
          this.router.navigate(['/controle-associacao']);
          this.ngxSpinnerService.hide();
        }
      });
    });

  }

  back(){      
    localStorage.setItem('id_user_associations','0');
    this.router.navigate(['/pages/controle-associacao']);
  }

}