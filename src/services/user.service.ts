import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { UserRegisterRequestDto } from 'src/dtos/user/user-register-request.dto';
import { UserResetPasswordConfirmationRequestDto } from 'src/dtos/user/user-reset-password-confirmation-request.dto';
import { UserResetPasswordConfirmationResponseDto } from 'src/dtos/user/user-reset-password-confirmation-response.dto';
import { UserResetPasswordRequestDto } from 'src/dtos/user/user-reset-password-request.dto';
import { UserResetPasswordResponseDto } from 'src/dtos/user/user-reset-password-response.dto';
import { UserUpdateInfoDto } from 'src/dtos/user/user-update-info.dto';
import { UserUpdatePasswordDto } from 'src/dtos/user/user-update-password.dto';
import { UserTypeEnum } from 'src/enums/user-type.enum';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { UserRolesEnum } from 'src/enums/user-roles.enum';

@Injectable()
export class UserService extends BaseService {

  deleteUser: UserListResponseDto | null = null;
  deleted: boolean = false;

  private url = `${environment.api.path}/user`;
  user: any[]
  userFilter: any[]
  userAdmin: any[]
  userAdminFilter: any[]
  userManager: any[]
  userManagerFilter: any[]

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  getAuthenticatedUser() {
    return this.httpClient
    .get<UserListResponseDto>(`${this.url}`, this.authorizedHeader)
  }

  resetPassword(dto: UserResetPasswordRequestDto) {
    return this.httpClient
      .post<UserResetPasswordResponseDto>(`${this.url}/reset-password`, dto, this.anonymousHeader);
  }

  firstAccess(dto: UserResetPasswordRequestDto) {
    return this.httpClient
      .post<UserResetPasswordResponseDto>(`${this.url}/first-access`, dto, this.anonymousHeader);
  }
 
  register(dto: UserRegisterRequestDto) {
    return this.httpClient
      .post<UserRegisterRequestDto>(`${this.url}/register`, dto, this.authorizedHeader);
  }

  registerWithoutAuth(dto: UserRegisterRequestDto) {
    return this.httpClient
      .post<UserRegisterRequestDto>(`${this.url}/registerWithoutAuth`, dto);
  }


  resetPasswordConfirmation(dto: UserResetPasswordConfirmationRequestDto) {
    return this.httpClient
      .put<UserResetPasswordConfirmationResponseDto>(`${this.url}/reset-password-confirmation`, dto, this.anonymousHeader)
  }

  getById(_id: string) {        
    return this.httpClient
      .get<UserListResponseDto>(`${this.url}/get-by-id/${_id}`, this.authorizedHeader)
  }
 
  updateById(_id: string, dto: UserRegisterRequestDto) {
    return this.httpClient
      .put<UserListResponseDto>(`${this.url}/update-by-id/${_id}`, dto , this.authorizedHeader)
  }
  

  listByType(type: UserTypeEnum) {
    return this.httpClient
      .get<UserListResponseDto[]>(`${this.url}/list-by-type/${type}`, this.authorizedHeader)
  }


  listByRole(role: UserRolesEnum) {
    return this.httpClient
      .get<UserListResponseDto[]>(`${this.url}/list-by-role/${role}`, this.authorizedHeader)
  }

  delete(_id: string) {
    return this.httpClient
      .delete<UserListResponseDto>(`${this.url}/delete-by-id/${_id}`, this.authorizedHeader)
  }

  updateUserInfo(_id: string, dto: UserUpdateInfoDto) {
    return this.httpClient
    .put<UserListResponseDto>(`${this.url}/update/${_id}`, dto, this.authorizedHeader)
  }

  updatePassword(dto: UserUpdatePasswordDto) {
    return this.httpClient
      .put<UserUpdatePasswordDto>(`${this.url}/update-password`, dto, this.authorizedHeader)
  }

  getUserList(): any[] {
    return this.user;
  }
  getUserFilterList(): any[] {
    return this.userFilter;
  }

  setUserList(nuevoValor: any[]) {    
    this.user = nuevoValor;
  }

  setUserFilterList(nuevoValor: any[]) {    
    this.userFilter = nuevoValor;
  }

  getUserAdminList(): any[] {
    return this.userAdmin;
  }
  getUserAdminFilterList(): any[] {
    return this.userAdminFilter;
  }

  setUserAdminList(nuevoValor: any[]) {    
    this.userAdmin = nuevoValor;
  }

  setUserAdminFilterList(nuevoValor: any[]) {    
    this.userAdminFilter = nuevoValor;
  }

  getUserManagerList(): any[] {
    return this.userManager;
  }
  getUserManagerFilterList(): any[] {
    return this.userManagerFilter;
  }

  setUserManagerList(nuevoValor: any[]) {
    this.userManager = nuevoValor;
  }

  setUserManagerFilterList(nuevoValor: any[]) {    
    this.userManagerFilter = nuevoValor;
  }

}
