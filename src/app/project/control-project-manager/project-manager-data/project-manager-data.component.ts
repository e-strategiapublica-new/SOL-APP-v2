
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { SupplierService } from 'src/services/supplier.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-project-manager-data',
  templateUrl: './project-manager-data.component.html',
  styleUrls: ['./project-manager-data.component.scss']
})
export class ProjectManagerDataComponent {
  user?: UserListResponseDto

  constructor(
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private supplierService: SupplierService,
  ) { }

  ngOnInit(): void {

    this.ngxSpinnerService.show();
    this.activatedRoute.params.subscribe((params) => {
      this.userService.getById(params['id']).subscribe({
        next: (success) => {
          this.supplierService.supplierList().subscribe({
            next: (successSup) => {
              for (let sup of successSup) {
                if (success.supplier == sup._id) {
                  success.supplier = sup.name
                }
              }
              this.user = success;
              this.ngxSpinnerService.hide();
            },

            error: (error) => {
              console.error(error.error.errors[0]);
            }
          });
          this.ngxSpinnerService.hide();
        },
        error: (error) => {          
          this.router.navigate(['/controle-project-manager']);
          this.ngxSpinnerService.hide();
        }
      });
    });

  }

  back(){      
    localStorage.setItem('id_user_manager','0');
    this.router.navigate(['/controle-project-manager']);
  }

}
