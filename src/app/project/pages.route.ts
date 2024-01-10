import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../guard/auth.guard";
import { AgreementGetByIdResolve } from "../resolvers/agreement-get-by-id.resolver";
import { BidGetByIdResolve } from "../resolvers/get-bid-by-id.resolver";
import { GetProposalByIdResolve } from "../resolvers/get-proposal-by-id.resolver";
import { GetProposalsByBidIdResolve } from "../resolvers/get-proposals-by-bid-id.resolver";
import { WorkPlanGetByIdResolve } from "../resolvers/workplan-get-by-id.resolver";
import { AdministrationContractsLicitacaoComponent } from "./administration-licitacoes/administration-contracts-licitacao/administration-contracts-licitacao.component";
import { DetailsContractComponent } from "./administration-licitacoes/administration-contracts-licitacao/details-contract/details-contract.component";
import { AdministrationDetailLicitacaoComponent } from "./administration-licitacoes/administration-detail-licitacao/administration-detail-licitacao.component";
import { AdministrationLicitacoesComponent } from "./administration-licitacoes/administration-licitacoes.component";
import { AdministrationLoteLicitacaoComponent } from "./administration-licitacoes/administration-lote-licitacao/administration-lote-licitacao.component";
import { AssociacaoContratosDataComponent } from "./associacao-contratos-data/associacao-contratos-data.component";
import { AssociacaoContratosComponent } from "./associacao-contratos/associacao-contratos.component";
import { AssociacaoConvenioDataComponent } from "./associacao-convenio-data/associacao-convenio-data.component";
import { AssociacaoConveniosComponent } from "./associacao-convenios/associacao-convenios.component";
import { AssociacaoEditLicitacaoComponent } from "./associacao-edit-licitacao/associacao-edit-licitacao.component";
import { AssociacaoLicitacaoDataComponent } from "./associacao-licitacao-data/associacao-licitacao-data.component";
import { AssociacaoLicitacaoViewProposalComponent } from "./associacao-licitacao-view-proposal/associacao-licitacao-view-proposal.component";
import { AssociacaoLicitacaoComponent } from "./associacao-licitacao/associacao-licitacao.component";
import { AssociacaoMapComponent } from "./associacao-map/associacao-map.component";
import { AssociacaoRegisterLicitacaoComponent } from "./associacao-register-licitacao/associacao-register-licitacao.component";
import { AssociationDataComponent } from "./association/association-data/association-data.component";
import { PdmDataComponent } from "./pdm/pdm-data/pdm-data.component";
import { ItemDataComponent } from "./items/item-data/item-data.component";
import { AssociationComponent } from "./association/association.component";
import { RegisterAssociationComponent } from "./association/register-association/register-association.component";
import { UpdateAssociationComponent } from "./association/update-association/update-association.component";
import { CategoriasComponent } from "./categorias/categorias.component";
import { ClassesComponent } from "./classes/classes.component";
import { PDMComponent } from "./pdm/pdm.component";
import { ItemsComponent } from "./items/items.component";
import { EditCategoriasComponent } from "./categorias/edit-categorias/edit-categorias.component";
import { EditClassComponent } from "./classes/edit-class/edit-class.component";
import { EditPdmComponent } from "./pdm/edit-pdm/edit-pdm.component";
import { EditItemComponent } from "./items/edit-item/edit-item.component";
import { NewCategoriasComponent } from "./categorias/new-categorias/new-categorias.component";
import { NewClassComponent } from "./classes/new-class/new-class.component";
import { NewPdmComponent } from "./pdm/new-pdm/new-pdm.component";
import { NewItemComponent } from "./items/new-item/new-item.component";
import { ContractTemplatesComponent } from "./contract-templates/contract-templates.component";
import { EditContractTemplatesComponent } from "./contract-templates/edit-contract-templates/edit-contract-templates.component";
import { NewContractTemplatesComponent } from "./contract-templates/new-contract-templates/new-contract-templates.component";
import { ContractsComponent } from "./contracts/contracts.component";
import { ControlAdministracaoComponent } from "./control-administracao/control-administracao.component";
import { RegisterUserAdministracaoComponent } from "./control-administracao/register-user-administracao/register-user-administracao.component";
import { UpdateUserAdministracaoComponent } from "./control-administracao/update-user-administracao/update-user-administracao.component";
import { UserDataAdministracaoComponent } from "./control-administracao/user-data-administracao/user-data-administracao.component";
import { ControlAssociacaoComponent } from "./control-associacao/control-associacao.component";
import { RegisterUserAssociacaoComponent } from "./control-associacao/register-user-associacao/register-user-associacao.component";
import { UpdateUserAssociacaoComponent } from "./control-associacao/update-user-associacao/update-user-associacao.component";
import { UserDataAssociacaoComponent } from "./control-associacao/user-data-associacao/user-data-associacao.component";
import { ControlFornecedorComponent } from "./control-fornecedor/control-fornecedor.component";
import { RegisterUserFornecedorComponent } from "./control-fornecedor/register-user-fornecedor/register-user-fornecedor.component";
import { UpdateUserFornecedorComponent } from "./control-fornecedor/update-user-fornecedor/update-user-fornecedor.component";
import { UserDataFornecedorComponent } from "./control-fornecedor/user-data-fornecedor/user-data-fornecedor.component";
import { ConveniosComponent } from "./convenios/convenios.component";
import { DadosConvenioComponent } from "./convenios/dados-convenio/dados-convenio.component";
import { EditConvenioComponent } from "./convenios/edit-convenio/edit-convenio.component";
import { NewConvenioComponent } from "./convenios/new-convenio/new-convenio.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FornecedorContratoSupplierComponent } from "./fornecedor-contrato/fornecedor-contrato-supplier/fornecedor-contrato-supplier.component";
import { FornecedorContratoComponent } from "./fornecedor-contrato/fornecedor-contrato.component";
import { FornecedorDetalheLicitacaoComponent } from "./fornecedor-licitacoes/fornecedor-detalhe-licitacao/fornecedor-detalhe-licitacao.component";
import { FornecedorLicitacoesComponent } from "./fornecedor-licitacoes/fornecedor-licitacoes.component";
import { FornecedorMapComponent } from "./fornecedor-map/fornecedor-map.component";
import { FornecedorAtualizarPropostaComponent } from "./fornecedor-proposta/fornecedor-atualizar-proposta/fornecedor-atualizar-proposta.component";
import { FornecedorEnviarPropostaComponent } from "./fornecedor-proposta/fornecedor-enviar-proposta/fornecedor-enviar-proposta.component";
import { FornecedorPropostaComponent } from "./fornecedor-proposta/fornecedor-proposta.component";
import { FornecedorComponent } from "./fornecedor/fornecedor.component";
import { RegisterSupplierComponent } from "./fornecedor/register-supplier/register-supplier.component";
import { SupplierDataComponent } from "./fornecedor/supplier-data/supplier-data.component";
import { UpdateFornecedorComponent } from "./fornecedor/update-fornecedor/update-fornecedor.component";
import { EditGroupComponent } from "./item-group/edit-group/edit-group.component";
import { ItemGroupComponent } from "./item-group/item-group.component";
import { NewGroupComponent } from "./item-group/new-group/new-group.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { PagesAppComponent } from "./pages.app.component";
import { EditProdutoComponent } from "./produtos/edit-produto/edit-produto.component";
import { NewProdutoComponent } from "./produtos/new-produto/new-produto.component";
import { ProdutosComponent } from "./produtos/produtos.component";
import { ProfileComponent } from "./profile/profile.component";
import { UpdateProfileComponent } from "./profile/update-profile/update-profile.component";
import { ProposalAcceptedComponent } from "./proposal-screening/proposal-accepted/proposal-accepted.component";
import { ProposalScreeningComponent } from "./proposal-screening/proposal-screening.component";
import { ProposalSentComponent } from "./proposal-screening/proposal-sent/proposal-sent.component";
import { RelatoriosComponent } from "./relatorios/relatorios.component";

import { AdministrationRelatorioComponent } from "./administration-relatorio/administration-relatorio.component";

import { AdministrationAgreementRevisorComponent } from "./administration-agreement-revisor/administration-agreement-revisor.component";
import { AdministrationIntegrationsComponent } from "./administration-integrations/administration-integrations.component";
import { AdministrationLicitacoesRevisorComponent } from "./administration-licitacoes-revisor/administration-licitacoes-revisor.component";
import { ProjectManagerDataComponent } from "./control-project-manager/project-manager-data/project-manager-data.component";
import { ProjectManagerEditComponent } from "./control-project-manager/project-manager-edit/project-manager-edit.component";
import { ProjectManagerComponent } from "./control-project-manager/project-manager/project-manager.component";
import { RegisterProjectManagerComponent } from "./control-project-manager/register-project-manager/register-project-manager.component";
import { ProjectManagerConveniosComponent } from "./project-manager-convenios/project-manager-convenios.component";
import { CreateProjectComponent } from "./projects/create-project/create-project.component";
import { ProjectsDataComponent } from "./projects/projects-data/projects-data.component";
import { ProjectsComponent } from "./projects/projects.component";
import { ReportContractComponent } from "./report-contract/report-contract.component";
import { ReportGeneralComponent } from "./report-general/report-general.component";
import { ReportGeneratedComponent } from "./report-generated/report-generated.component";
import { LicitacoesRevisaoComponent } from "./gestor-projeto-licitacoes/licitacoes-revisao/licitacoes-revisao.component";
import { LicitacoesVisualizacaoComponent } from "./gestor-projeto-licitacoes/licitacoes-visualizacao/licitacoes-visualizacao.component";


const routerConfig: Routes = [
  {
    path: "",
    component: PagesAppComponent,
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "profile", component: ProfileComponent },
      { path: "update-profile", component: UpdateProfileComponent },
      { path: "notifications", component: NotificationsComponent },
      { path: "contracts", component: ContractsComponent },
      { path: "controle-admin", component: ControlAdministracaoComponent },
      { path: "controle-admin/registrar-usuario", component: RegisterUserAdministracaoComponent },
      { path: "controle-admin/editar-usuario/:id", component: UpdateUserAdministracaoComponent },
      { path: "controle-admin/dados-usuario/:id", component: UserDataAdministracaoComponent },
      { path: "controle-associacao", component: ControlAssociacaoComponent },
      { path: "controle-associacao/registrar-usuario", component: RegisterUserAssociacaoComponent },
      { path: "controle-associacao/editar-usuario/:id", component: UpdateUserAssociacaoComponent },
      { path: "controle-associacao/dados-usuario/:id", component: UserDataAssociacaoComponent },
      { path: "controle-fornecedor", component: ControlFornecedorComponent },
      { path: "controle-fornecedor/registrar-usuario", component: RegisterUserFornecedorComponent },
      { path: "controle-project-manager", component: ProjectManagerComponent },
      { path: "controle-project-manager/registrar-project-manager", component: RegisterProjectManagerComponent },
      { path: "controle-project-manager/project-manager/:id", component: ProjectManagerDataComponent },
      { path: "controle-project-manager/editar-project-manager/:id", component: ProjectManagerEditComponent },
      { path: "project-manager-convenios", component: ProjectManagerConveniosComponent },
      { path: "controle-fornecedor/editar-usuario/:id", component: UpdateUserFornecedorComponent },
      { path: "controle-fornecedor/dados-usuario/:id", component: UserDataFornecedorComponent },
      { path: "convenios", component: ConveniosComponent },
      { path: "relatorios-licitacao", component: AdministrationRelatorioComponent },
      {
        path: "convenios/detalhes-convenio/:_id",
        component: DadosConvenioComponent,
        resolve: { agreement: AgreementGetByIdResolve },
      },      
      { path: "convenios/novo-convenio", component: NewConvenioComponent },
      {
        path: "convenios/edit-convenio/:_id",
        component: EditConvenioComponent,
        resolve: { agreement: AgreementGetByIdResolve },
      },
      {
        path: "convenios/convenio-data/:_id",
        component: AssociacaoConvenioDataComponent,
        resolve: { agreement: AgreementGetByIdResolve },
      },
      { path: "licitacoes/licitacao-register", component: AssociacaoRegisterLicitacaoComponent },
      {
        path: "licitacoes/licitacao-edit/:_id",
        component: AssociacaoEditLicitacaoComponent,
        resolve: { bid: BidGetByIdResolve },
      },
      {
        path: "licitacoes/licitacao-data/:_id",
        component: AssociacaoLicitacaoDataComponent,
        resolve: { bid: BidGetByIdResolve },
      },
      {path: "licitacoes/gestor-revisor-licitacao", component: LicitacoesRevisaoComponent},
      {path: "licitacoes/gestor-visualizacao-licitacao", component: LicitacoesVisualizacaoComponent},
      { path: "fornecedor", component: FornecedorComponent },
      { path: "fornecedor/registrar-fornecedor", component: RegisterSupplierComponent },
      { path: "fornecedor/dados-fornecedor/:id", component: SupplierDataComponent },
      { path: "fornecedor/editar-fornecedor/:id", component: UpdateFornecedorComponent },
      { path: "fornecedor/map-fornecedor", component: FornecedorMapComponent },
      { path: "relatorios", component: RelatoriosComponent },
      { path: "associacao", component: AssociationComponent },
      { path: "associacao/registrar-associacao", component: RegisterAssociationComponent },
      { path: "associacao/editar-associacao/:id", component: UpdateAssociationComponent },
      { path: "associacao/dados-associacao/:id", component: AssociationDataComponent },
      { path: "pdm/dados-pdm/:id", component: PdmDataComponent },
      { path: "items/dados-item/:id", component: ItemDataComponent },
      { path: "associacao/map-associacao", component: AssociacaoMapComponent },
      { path: "associacao/convenios", component: AssociacaoConveniosComponent },
      { path: "associacao/licitacoes", component: AssociacaoLicitacaoComponent },
      {
        path: "associacao/licitacoes/view-proposal/:_id",
        component: AssociacaoLicitacaoViewProposalComponent,
        resolve: { proposals: GetProposalsByBidIdResolve },
      },
      { path: "associacao/contratos", component: AssociacaoContratosComponent },
      { path: "associacao/contrato-data/:id", component: AssociacaoContratosDataComponent },
      { path: "item-group", component: ItemGroupComponent },
      { path: "item-group/new-group", component: NewGroupComponent },
      {
        path: "item-group/edit-group/:_id",
        component: EditGroupComponent,
        resolve: { workPlan: WorkPlanGetByIdResolve },
      },
      { path: "proposal-screening", component: ProposalScreeningComponent },
      { path: "licitacoes", component: AdministrationLicitacoesComponent },
      { path: "bids-proofreader", component: AdministrationLicitacoesRevisorComponent },
      { path: "agreement-proofreader", component: AdministrationAgreementRevisorComponent },
      {
        path: "licitacoes/detalhes-licitacoes/:_id",
        component: AdministrationDetailLicitacaoComponent,
        resolve: { bid: BidGetByIdResolve },
      },
      { path: "licitacoes/lote-licitacoes", component: AdministrationLoteLicitacaoComponent },
      { path: "licitacoes/contratos-licitacoes", component: AdministrationContractsLicitacaoComponent },
      { path: "licitacoes/contratos-licitacoes/:_id", component: DetailsContractComponent },
      { path: "proposal-screening/proposal-accepted", component: ProposalAcceptedComponent },
      { path: "proposal-screening/proposal-sent", component: ProposalSentComponent },
      { path: "fornecedor/contratos", component: FornecedorContratoComponent },
      { path: "fornecedor/contratos/contrato-supplier/:_id", component: FornecedorContratoSupplierComponent },
      { path: "fornecedor/licitacoes", component: FornecedorLicitacoesComponent },
      {
        path: "fornecedor/licitacoes/detalhes-licitacoes/:_id",
        component: FornecedorDetalheLicitacaoComponent,
        resolve: { bid: BidGetByIdResolve },
      },
      { path: "fornecedor/proposta", component: FornecedorPropostaComponent },
      {
        path: "fornecedor/proposta/atualizar/:_id",
        component: FornecedorAtualizarPropostaComponent,
        resolve: { proposal: GetProposalByIdResolve },
      },
      { path: "fornecedor/proposta/enviar", component: FornecedorEnviarPropostaComponent },
      { path: "produtos", component: ProdutosComponent },
      { path: "report-contracts", component: ReportContractComponent },
      { path: "report-general", component: ReportGeneralComponent },
      { path: "report-generated", component: ReportGeneratedComponent },
      { path: "produtos/registrar-produto", component: NewProdutoComponent },
      { path: "produtos/editar-produto", component: EditProdutoComponent },
      { path: "classes", component: ClassesComponent },      
      { path: "pdm", component: PDMComponent },      
      { path: "categorias", component: CategoriasComponent },
      { path: "items", component: ItemsComponent },
      { path: "categorias/registrar-categoria", component: NewCategoriasComponent },
      { path: "classes/registrar-class", component: NewClassComponent },
      { path: "pdm/registrar-pdm", component: NewPdmComponent },
      { path: "items/registrar-item", component: NewItemComponent },
      { path: "categorias/editar-categoria", component: EditCategoriasComponent },
      { path: "classes/editar-class", component: EditClassComponent },
      { path: "pdm/editar-pdm", component: EditPdmComponent },
      { path: "items/editar-item", component: EditItemComponent },
      { path: "modelo-contratos", component: ContractTemplatesComponent },
      { path: "modelo-contratos/novo-modelo", component: NewContractTemplatesComponent },
      { path: "modelo-contratos/editar-modelo/:_id", component: EditContractTemplatesComponent },
      { path: "integracoes", component: AdministrationIntegrationsComponent },
      { path: "projetos", component: ProjectsComponent },
      { path: "criar-projeto", component: CreateProjectComponent },
      { path: "dados-projeto/:_id", component: ProjectsDataComponent,
    },

      { path: "**", component: NotfoundComponent },
    ],

    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routerConfig)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
