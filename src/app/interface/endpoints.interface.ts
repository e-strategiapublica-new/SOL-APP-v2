import { EndPointsStatusEnum } from "src/enums/endpoints-status.enum";
import { EndPointsTypeEnum } from "src/enums/endpoints-type.enum";

export abstract class EndPointsInterface {
  _id: string;
  endpointPath: string;
  token: string;
  frequency: string;
  lastRun?: Date;
  status: EndPointsStatusEnum;
  endpointType: EndPointsTypeEnum;
}