import { Injectable } from '@angular/core';
import { LocalStorageEnum } from 'src/app/interface/localstorage.enum';
import { LocalStorageKeysEnum } from 'src/enums/local-storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  getConvenio() {
    const data = localStorage.getItem(LocalStorageEnum.convenio);
    return data === null ? undefined : JSON.parse(data);
  }

  getEditConvenio() {
    const data = localStorage.getItem(LocalStorageEnum.editconvenio);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataLicitacao() {
    const data = localStorage.getItem(LocalStorageEnum.licitacao);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataLote() {
    const data = localStorage.getItem(LocalStorageEnum.lote);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataProposal() {
    const data = localStorage.getItem(LocalStorageEnum.enviarproposta);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataContratos() {
    const data = localStorage.getItem(LocalStorageEnum.contrato);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataPlano() {
    const data = localStorage.getItem(LocalStorageEnum.plano);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataCostItems() {
    const data = localStorage.getItem(LocalStorageEnum.editcostitems);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataModelContractId() {
    const data = localStorage.getItem(LocalStorageEnum.editModelContracitems);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataProdutos() {
    const data = localStorage.getItem(LocalStorageEnum.editprodutos);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataCategoria() {    
    const data = localStorage.getItem(LocalStorageEnum.editcategoria);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataPdm() {    
    const data = localStorage.getItem(LocalStorageEnum.editpdm);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataClass() {
    const data = localStorage.getItem(LocalStorageEnum.editclass);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataItem() {
    const data = localStorage.getItem(LocalStorageEnum.edititem);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataUser() {
    const data = localStorage.getItem(LocalStorageKeysEnum.user);
    return data === null ? undefined : JSON.parse(data);
  }
}
