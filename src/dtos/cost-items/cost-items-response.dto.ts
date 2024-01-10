import { UnitMeasureEnum } from "src/enums/unit-measure.enum";

export abstract class CostItemsResponseDto {

    _id: string;
    code?: string;
    name?: string;
    unitMeasure?: UnitMeasureEnum;
    category?: any;
    product?: any;
    specification?: string;
    sustainable?: string;
    product_relation?: string
}
