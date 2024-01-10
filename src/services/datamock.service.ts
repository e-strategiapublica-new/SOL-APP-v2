import { Injectable } from '@angular/core';
import { LocalStorageEnum } from 'src/app/interface/localstorage.enum';
import { ConveniosInterface } from 'src/app/interface/convenios-request.dto';
import { ItensInterface } from 'src/app/interface/items.interface';
import { LicitationInterface } from 'src/app/interface/licitacao.interface';
import { PlanoDeTrabalhoInterface } from 'src/app/interface/plano-de-trabalho.interface';
import { LotesInterface } from 'src/app/interface/lotes.interface';
import { ContratosInterface } from 'src/app/interface/contratos.interface';

@Injectable({
  providedIn: 'root'
})
export class DatamockService {
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

  convenios: ConveniosInterface[] = [

    {
      _id: 2,
      name: 'Mohamed Ali Gusta de Alencar Alves Prado',
      object: 'Convênio2020',
      association: 'Associação para Testes',
      review: 'Adm Geral',
      number: 47328472384293,
      local: 'Monte Santo / BA',
      datesub: '11/09/2001',
      datemat: '12/12/2012',
      value: '983475',
      situation: 'Em espera'
    },
    {
      _id: 3,
      name: 'Mohamed Ali Gusta de Alencar Alves Prado',
      object: 'Convênio2020',
      association: 'Associação para Testes',
      review: 'Adm Geral',
      number: 47328472384293,
      local: 'Monte Santo / BA',
      datesub: '11/09/2001',
      datemat: '12/12/2012',
      value: '983475',
      situation: 'Em espera'
    },
    {
      _id: 4,
      name: 'Mohamed Ali Gusta de Alencar Alves Prado',
      object: 'Convênio2020',
      association: 'Associação para Testes',
      review: 'Adm Geral',
      number: 47328472384293,
      local: 'Monte Santo / BA',
      datesub: '11/09/2001',
      datemat: '12/12/2012',
      value: '983475',
      situation: 'Em espera'
    },
    {
      _id: 5,
      name: 'Mohamed Ali Gusta de Alencar Alves Prado',
      object: 'Convênio2020',
      association: 'Associação para Testes',
      review: 'Adm Geral',
      number: 47328472384293,
      local: 'Monte Santo / BA',
      datesub: '11/09/2001',
      datemat: '12/12/2012',
      value: '983475',
      situation: 'Em espera'
    },
    {
      _id: 6,
      name: 'Mohamed Ali Gusta de Alencar Alves Prado',
      object: 'Convênio2020',
      association: 'Associação para Testes',
      review: 'Adm Geral',
      number: 47328472384293,
      local: 'Monte Santo / BA',
      datesub: '11/09/2001',
      datemat: '12/12/2012',
      value: '983475',
      situation: 'Em espera'
    },
    {
      _id: 7,
      name: 'Mohamed Ali Gusta de Alencar Alves Prado',
      object: 'Convênio2020',
      association: 'Associação para Testes',
      review: 'Adm Geral',
      number: 47328472384293,
      local: 'Monte Santo / BA',
      datesub: '11/09/2001',
      datemat: '12/12/2012',
      value: '983475',
      situation: 'Em espera'
    },
    {
      _id: 8,
      name: 'Mohamed Ali Gusta de Alencar Alves Prado',
      object: 'Convênio2020',
      association: 'Associação para Testes',
      review: 'Adm Geral',
      number: 47328472384293,
      local: 'Monte Santo / BA',
      datesub: '11/09/2001',
      datemat: '12/12/2012',
      value: '983475',
      situation: 'Em espera'
    },
    {
      _id: 9,
      name: 'Mohamed Ali Gusta de Alencar Alves Prado',
      object: 'Convênio2020',
      association: 'Associação para Testes',
      review: 'Adm Geral',
      number: 47328472384293,
      local: 'Monte Santo / BA',
      datesub: '11/09/2001',
      datemat: '12/12/2012',
      value: '983475',
      situation: 'Em espera'
    },

  ]

  plano: PlanoDeTrabalhoInterface[] = [
    {
      _id: 100,
      name: 'Bens / Papelaria',
      number: '03'
    },
    {
      _id: 101,
      name: 'Bens / Papelaria',
      number: '03'
    },

  ]

  itens: ItensInterface[] = [
    {
      _id: 1,
      itemconsumo: "BENS / VEÍCULOS / Item Sint ut dolor quo saepe. - Descricao Sint ut dolor quo saepe.",
      quantidade: "261,03 / 261,03 Unidade(s)",
      custo: "38239"
    },
  ]

  licitacoes: LicitationInterface[] = [
    {
      _id: 1,
      numero: '2258 / 2023',
      association: 'ASSOCIAÇÃO DOS AGRICULTORES FAMILIARES DA COMUNIDADE UMBU',
      modalidade: 'Aberta/Pública',
      status: 'Em Análise',
      revisor: 'Adm Geral',
      datastart: '12/09/2001',
      dataend: '25/12/2012',
      description: 'Teste Editar ou remover proposta',
      class: 'Bens',
      local: 'Não informado',
      prazo: '12/07/2021',
      dias: '2 dias',
      convenio: '1234567',
      tipo: 'Preço por Lote',
      lote: '1 - lote 01',
      Item: 'Notebook dell',
      quantity: '10',
      value:'10000',
      supplier: 'Fornecedor - 01',
      site: 'Não informado',
      proposal: 'Proposta enviada'
    },
    {
      _id: 2,
      numero: '2258 / 2023',
      association: 'ASSOCIAÇÃO DOS AGRICULTORES FAMILIARES DA COMUNIDADE UMBU',
      modalidade: 'Aberta/Pública',
      status: 'Aguardando Liberação',
      revisor: 'Adm Geral',
      datastart: '12/09/2001',
      dataend: '25/12/2012',
      description: 'Teste Editar ou remover proposta',
      class: 'Bens',
      local: 'Não informado',
      prazo: '12/07/2021',
      dias: '2 dias',
      convenio: '1234567',
      tipo: 'Preço por Lote',
      lote: '1 - lote 01',
      Item: 'Notebook dell',
      value:'10000',
      quantity: '10',
      supplier: 'Fornecedor - 01',
      site: 'Não informado',
      proposal: 'Proposta enviada'
    },
    {
      _id: 3,
      numero: '2258 / 2023',
      association: 'ASSOCIAÇÃO DOS AGRICULTORES FAMILIARES DA COMUNIDADE UMBU',
      modalidade: 'Aberta/Pública',
      status: 'Em Rascunho',
      revisor: 'Adm Geral',
      datastart: '12/09/2001',
      dataend: '25/12/2012',
      description: 'Teste Editar ou remover proposta',
      class: 'Bens',
      local: 'Não informado',
      prazo: '12/07/2021',
      dias: '2 dias',
      convenio: '1234567',
      tipo: 'Preço por Lote',
      lote: '1 - lote 01',
      Item: 'Notebook dell',
      value:'10000',
      quantity: '10',
      supplier: 'Fornecedor - 01',
      site: 'Não informado',
      proposal: 'Proposta enviada'
    },
    {
      _id: 4,
      numero: '2258 / 2023',
      association: 'ASSOCIAÇÃO DOS AGRICULTORES FAMILIARES DA COMUNIDADE UMBU',
      modalidade: 'Aberta/Pública',
      status: 'Deserta',
      revisor: 'Adm Geral',
      datastart: '12/09/2001',
      dataend: '25/12/2012',
      description: 'Teste Editar ou remover proposta',
      class: 'Bens',
      local: 'Não informado',
      prazo: '12/07/2021',
      dias: '2 dias',
      convenio: '1234567',
      tipo: 'Preço por Lote',
      lote: '1 - lote 01',
      Item: 'Notebook dell',
      value:'10000',
      quantity: '10',
      supplier: 'Fornecedor - 01',
      site: 'Não informado',
      proposal: 'Proposta enviada'
    },
    {
      _id: 5,
      numero: '2258 / 2023',
      association: 'ASSOCIAÇÃO DOS AGRICULTORES FAMILIARES DA COMUNIDADE UMBU',
      modalidade: 'Aberta/Pública',
      status: 'Concluída',
      revisor: 'Adm Geral',
      datastart: '12/09/2001',
      dataend: '25/12/2012',
      description: 'Teste Editar ou remover proposta',
      class: 'Bens',
      local: 'Não informado',
      prazo: '12/07/2021',
      dias: '2 dias',
      convenio: '1234567',
      tipo: 'Preço por Lote',
      lote: '1 - lote 01',
      Item: 'Notebook dell',
      value:'10000',
      quantity: '10',
      supplier: 'Fornecedor - 01',
      site: 'Não informado',
      proposal: 'Proposta enviada'
    },
    {
      _id: 6,
      numero: '2258 / 2023',
      association: 'ASSOCIAÇÃO DOS AGRICULTORES FAMILIARES DA COMUNIDADE UMBU',
      modalidade: 'Aberta/Pública',
      status: 'Cancelada',
      revisor: 'Adm Geral',
      datastart: '12/09/2001',
      dataend: '25/12/2012',
      description: 'Teste Editar ou remover proposta',
      class: 'Bens',
      local: 'Não informado',
      prazo: '12/07/2021',
      dias: '2 dias',
      convenio: '1234567',
      tipo: 'Preço por Lote',
      lote: '1 - lote 01',
      Item: 'Notebook dell',
      value:'10000',
      quantity: '10',
      supplier: 'Fornecedor - 01',
      site: 'Não informado',
      proposal: 'Proposta enviada'
    },
    {
      _id: 6,
      numero: '2258 / 2023',
      association: 'ASSOCIAÇÃO DOS AGRICULTORES FAMILIARES DA COMUNIDADE UMBU',
      modalidade: 'Aberta/Pública',
      status: 'Aberta',
      revisor: 'Adm Geral',
      datastart: '12/09/2001',
      dataend: '25/12/2012',
      description: 'Teste Editar ou remover proposta',
      class: 'Bens',
      local: 'Não informado',
      prazo: '12/07/2021',
      dias: '2 dias',
      convenio: '1234567',
      tipo: 'Preço por Lote',
      lote: '1 - lote 01',
      Item: 'Notebook dell',
      value:'10000',
      quantity: '10',
      supplier: 'Fornecedor - 01',
      site: 'Não informado',
      proposal: 'Proposta enviada'
    },
  ]

  lotes: LotesInterface[] = [
    {
      _id: 1,
      numero: "1 - lote 01",
      itens: "2",
      status: "Proposta enviada",
      item: "3",
      quantity: "1",
      value: "100",
      frete: "10",
      situation: 'Adjudicado',
      supplier: 'Fornecedor 01'
    },

    {
      _id: 2,
      numero: "2 - lote 01",
      itens: "3",
      status: "Proposta enviada",
      item: "4",
      quantity: "1",
      value: "100",
      frete: "10",
      situation: 'Adjudicado',
      supplier: 'Fornecedor 02'
    },

    {
      _id: 3,
      numero: "3 - lote 01",
      itens: "4",
      status: "Sem proposta",
      item: "5",
      quantity: "1",
      value: "100",
      frete: "10",
      situation: 'Adjudicado',
      supplier: 'Fornecedor 03'
    },

    {
      _id: 4,
      numero: "4 - lote 01",
      itens: "5",
      status: "Sem proposta",
      item: "6",
      quantity: "1",
      value: "100",
      frete: "10",
      situation: 'Deserto',
      supplier: 'Fornecedor 04'
    }

  ]

  contratos:ContratosInterface []=[
    {
      _id: 1,
      titulo: '214/2019',
      licitacaodata: '1920/2021', 
      licitacao: '848/2019',
      valor: '10319',
      status: 'Aguardando Assinatura',
      associacao: 'Nome da associação',
      associacaodata: '11/03/2021 - 15:40h',
      fornecedor: '25/07/2022 - 15:01h',
    },
    {
      _id: 2,
      titulo: '214/2019',
      licitacaodata: '1920/2021',
      licitacao: '848/2019',
      valor: '10319',
      status: 'Aguardando Assinatura',
      associacao: 'Nome da associação',
      associacaodata: '11/03/2021 - 15:40h',
      fornecedor: '25/07/2022 - 15:01h',
    },
    {
      _id: 3,
      titulo: '214/2019',
      licitacaodata: '1920/2021',
      licitacao: '848/2019',
      valor: '10319',
      status: 'Assinado',
      associacao: 'Nome da associação',
      associacaodata: '11/03/2021 - 15:40h',
      fornecedor: '25/07/2022 - 15:01h',
    },
   
  ]


  getConvenios(): ConveniosInterface[] {
    return this.convenios;
  }
}
