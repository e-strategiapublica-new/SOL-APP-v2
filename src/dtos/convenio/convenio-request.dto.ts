export abstract class ConvenioRequestDto {
    register_number: string;
    register_object: string;
    status: string;
    city: string;
    states: string
    value: number;
    signature_date: Date;
    validity_date: Date;
    associationId: string;
    projectId?: string;
    manager?: string;
    project?: string
    
}