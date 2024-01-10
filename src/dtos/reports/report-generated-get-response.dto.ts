export abstract class ReportGeneratedGetResponseDto {    
    _id: string;
    situation: string;
    name: string;
    archive: string;
    generatedBy?: any;
    createdAt: Date;
    updatedAt: Date;
}