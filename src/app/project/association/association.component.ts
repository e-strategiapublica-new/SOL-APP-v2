import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { AssociationService } from 'src/services/association.service';
import { DeleteAssociationComponent } from './delete-association/delete-association.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FilterFuzzy from 'src/utils/filterFuzzy.util';
import Fuse from 'fuse.js';
import { UserAuthenticatedDto } from 'src/dtos/auth/user-authenticated.dto';
import { AuthService } from 'src/services/auth.service';


@Component({
  selector: 'app-association',
  templateUrl: './association.component.html',
  styleUrls: ['./association.component.scss']
})
export class AssociationComponent implements OnInit {

  currentPage: number = 1;
  itensPerPage: number = 8;
  filterTerm: string;

  associationList!: AssociationResponseDto[];
  associationFilterList!: AssociationResponseDto[];
  form: FormGroup;

  user: UserAuthenticatedDto;

  constructor(
    public  authService: AuthService,
    private formBuilder: FormBuilder,
    private associationService: AssociationService,
    private ngbModal: NgbModal,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.getAssociation();
    let user: any = localStorage.getItem('user');
    user = JSON.parse(user);
    this.user = user;
    this.form.controls['search'].valueChanges.subscribe((text: string) => {
      if (text) {       

        const name = this.associationList.filter(obj => ((obj.name).toLowerCase()).includes(text.toLowerCase()));
        const cnpj = this.associationList.filter(obj => ((obj.cnpj).toLowerCase()).includes(text.toLowerCase()));
        const municipality = this.associationList.filter(obj => ((obj.address.city).toLowerCase()).includes(text.toLowerCase()));
        
        const array = [...name, ...cnpj, ...municipality]
        const dataArr = new Set(array)
        const result = [...dataArr];        

        this.associationFilterList = result
      }
      else
        this.associationFilterList = this.associationList
    });

  }

  getAssociation() {
    this.associationService.list().subscribe({
      next: (success) => {
        this.associationList = success;
        this.associationFilterList = success;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  openModal(i: AssociationResponseDto) {


    this.associationService.deleteAssociation = this.associationList.find(item => (item._id === i._id));
    this.associationService.deleted = false;

    const modal = this.ngbModal.open(DeleteAssociationComponent, {
      centered: true,
      backdrop: true,
      size: 'md',
    });
    modal.result.then(
      () => { },
      error => {
        this.getAssociation();
      }
    );

  }

  navigateToItem(id: string) {
    this.router.navigate(['/pages/associacao/dados-associacao/' + id]);
  }

}
