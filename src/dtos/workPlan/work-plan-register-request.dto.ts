export abstract class WorkPlanRegisterRequest {
  name?: string;
  product?: Array<{ quantity?: number; unit?: string; unitValue?: number; costItems?: string }>;
}

export interface WorkPlanProductInterface {
  quantity?: number;
  unitValue?: number;
  costItems?: string;
  unit?: string;
}
