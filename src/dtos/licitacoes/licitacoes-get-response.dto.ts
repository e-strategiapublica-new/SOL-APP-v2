export abstract class LicitacoesGetResponseDto {
    _id: string;
    bid_count: string;
    description: string;
    classification: string;
    start_at: string;
    end_at: string;
    modality: string;
    status: string;
    association?: any;
    createdAt: Date;    
}