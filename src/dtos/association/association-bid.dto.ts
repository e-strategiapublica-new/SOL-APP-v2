import { AllotmentRequestDto } from "src/app/interface/licitacao.interface";
import { BidModalityEnum } from "src/enums/bid-modality.enum";
import { BidStatusEnum } from "src/enums/bid-status.enum";
import { BidTypeEnum } from "src/enums/bid-type.enum";

export abstract class AssociationBidRequestDto {
    bid_count?: string
    description?: string;
    agreementId?: string;
    classification?: string;
    start_at?: string;
    end_at?: string;
    days_to_delivery?: string;
    days_to_tiebreaker?: string;
    local_to_delivery?: string;
    status?: BidStatusEnum;
    bid_type?: BidTypeEnum;
    modality?: BidModalityEnum;
    aditional_site?: string;
    add_allotment?: AllotmentRequestDto[];
    invited_suppliers?: string[];
    editalFile?: string;
    ataFile?: string;
    state?: string;
    city?: string;
}