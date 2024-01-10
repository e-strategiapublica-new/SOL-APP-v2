import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CepResponseDto } from "../dtos/address/cep-response.dto";

@Injectable()
export class CepService {

  constructor(
    private http: HttpClient
  ) { }

  buscarCep(cep: string) {

    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`)
      .toPromise()
      .then(response => {
        return this.converterRespostaParaCep(response)
      })
  }

  private converterRespostaParaCep(cepResposta: any): CepResponseDto {

    let cep = new CepResponseDto();
    cep.cep = cepResposta.cep;
    cep.logradouro = cepResposta.logradouro;
    cep.complemento = cepResposta.complemento;
    cep.bairro = cepResposta.bairro;
    cep.cidade = cepResposta.localidade;
    cep.uf = cepResposta.uf;
    return cep;
  }
}