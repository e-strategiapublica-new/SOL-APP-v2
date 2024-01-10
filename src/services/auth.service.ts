import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticateRequestDto } from 'src/dtos/auth/authenticate-request.dto';
import { UserAuthenticatedDto } from 'src/dtos/auth/user-authenticated.dto';
import { LocalStorageKeysEnum } from 'src/enums/local-storage-keys.enum';
import jwt_decode from "jwt-decode";
import { JwtPayloadDto } from 'src/dtos/auth/jwt-payload.dto';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService extends BaseService {

  private url = `${environment.api.path}/authentication`;

  user: any;

  constructor(
    private readonly httpClient: HttpClient,
  ) {
    super();
  }

  authenticate(dto: AuthenticateRequestDto) {
    return this.httpClient.post<UserAuthenticatedDto>(
      `${this.url}/authenticate`,
      this.encrypt(JSON.stringify(dto)),
      this.anonymousHeader
    );
  }

  authenticated() {
    return this.httpClient.get(
      `${this.url}/authenticated`,
      this.authorizedHeader
    );
  }


  getAuthenticatedUserId(): string | null {
    const authenticatedUser = localStorage.getItem(LocalStorageKeysEnum.user);
    if (authenticatedUser) {
      const parsedUser = JSON.parse(authenticatedUser) as UserAuthenticatedDto;
      return parsedUser._id;
    }
    return null;
  }


  // refreshToken() {
  //   return this.httpClient.post<UserAuthenticatedDto>(
  //     `${this.url}/refresh`,
  //     undefined,
  //     this.refreshHeader
  //   );
  // }

  setAuthenticatedUser(dto: UserAuthenticatedDto) {
    localStorage.setItem(LocalStorageKeysEnum.user, JSON.stringify(dto));
  }

  // setKeepConnected(keepConnected: boolean) {
  //   const user = localStorage.getItem(LocalStorageKeysEnum.user);
  //   if (!!user) {
  //     let userObj = JSON.parse(user);
  //     localStorage.setItem(LocalStorageKeysEnum.user, JSON.stringify(Object.assign(userObj, { keepConnected })));
  //   } else {
  //     localStorage.setItem(LocalStorageKeysEnum.user, JSON.stringify(keepConnected));
  //   }
  // }

  getAuthenticatedUser() {
    const user = localStorage.getItem(LocalStorageKeysEnum.user);
    this.user = user === null ? undefined : JSON.parse(user);    
    return this.user;
  }

  removeAuthenticatedUser() {
    localStorage.removeItem(LocalStorageKeysEnum.user);
  }

  // logoutServer() {
  //   this.httpClient.post(`${this.url}/logout`, undefined, this.authorizedHeader).subscribe();
  // }

  getPayloadFromJWT() {
    return jwt_decode<JwtPayloadDto>(
      (this.getAuthenticatedUser() as UserAuthenticatedDto).token
    );
  }

  // getRefreshTokenFromJWT() {
  //   return jwt_decode<JwtPayloadDto>(
  //     (this.getAuthenticatedUser() as UserAuthenticatedDto).refreshToken
  //   );
  // }

  isJwtValid() {
    const user = this.getAuthenticatedUser();

    if (!user) {
      return false;
    }

    const payload = this.getPayloadFromJWT();

    if (payload.exp < new Date().getTime()/1_000) {
      return false;
    }

    // if (payload.tfaRegistered && !payload.tfaAuthenticate) {
    //   return false;
    // }

    return true;
  }

}
