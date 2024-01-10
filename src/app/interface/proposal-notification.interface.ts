import { ProposalStatusEnum } from "src/enums/proposal-status.enum";


export interface ProposalNotificationInterface {
 readonly _id: string,
 readonly total_value: string,
 readonly association_accept: boolean,
 readonly supplier_accept: boolean,
 readonly status: ProposalStatusEnum,
 readonly deleted: boolean,
 readonly bid: string,
 readonly allotment: string,
 readonly proposalWin: boolean,
 readonly proposedBy: {
    readonly _id: string,
    readonly name: string,
    readonly email: string,
    readonly document: string,
    readonly phone: string,
    readonly status: string,
    readonly type: string,
    readonly profilePicture: null,
    readonly supplier: string,
    readonly notification_list: [],
    readonly createdAt: string,
    readonly updatedAt: string,
  },

  readonly acceptedFornecedor: {
    readonly  _id: string,
    readonly name: string,
    readonly email: string,
    readonly document: string,
    readonly phone: string,
    readonly status: string,
    readonly type: string,
    readonly association: string,
    readonly createdAt: string,
    readonly updatedAt: string,
  
  },

}