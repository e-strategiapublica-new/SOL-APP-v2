import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

  user!: UserListResponseDto

  constructor(
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private translate: TranslateService,

    private ngbModal: NgbModal,
  ) { }

  ngOnInit(): void {
    this.user = this.userService.deleteUser!;
    let cancel = document.getElementById('cancel');
    cancel?.focus();
  }

  deleteUser() {
    this.ngxSpinnerService.show();
    this.userService.delete(this.user._id).subscribe({
      next: (data) => {
        this.ngxSpinnerService.hide();
        this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_DELETE_USER'), '', { progressBar: true });
        this.userService.deleted = true;
        this.ngbModal.dismissAll();
      },
      error: (error) => {
        this.ngxSpinnerService.hide();
        console.error(error);
        this.toastrService.error(this.translate.instant('TOASTRS.ERROR_DELETE_USER'), '', { progressBar: true });
      }
    });
  }

  closeModal() {
    this.ngbModal.dismissAll();
  }

}
