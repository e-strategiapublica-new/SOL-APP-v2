export abstract class AuthenticateRequestDto {
  constructor(public email: string, public password: string) {}
}
