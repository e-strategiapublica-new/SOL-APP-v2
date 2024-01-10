import { UnitMeasureEnum } from "src/enums/unit-measure.enum";

export abstract class CostItemsRegisterDto {
    code: string;
    name: string;
    unitMeasure: UnitMeasureEnum;
    categoryId: string;
    productId: string;
    specification: string;
    sustainable: boolean;
    product_relation: string
}
