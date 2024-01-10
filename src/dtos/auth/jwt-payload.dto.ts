export abstract class JwtPayloadDto {
  constructor(
    public userId: string,
    public email: string,
    public walletAddress: string,
    public tfaRegistered: boolean,
    public tfaAuthenticate: boolean,
    public iat: number,
    public exp: number
  ) {}
}
