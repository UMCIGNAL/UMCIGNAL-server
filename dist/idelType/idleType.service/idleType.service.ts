import { addIdleType } from "../idleType.dto/idleType.dto";
import { addIdleTypeModel } from "../idleType.model/idleType.model";

export const addIdleTypeService = async (
    user_id : number,
    idleType : addIdleType
): Promise<void> => {
    console.log("Service connection");
    await addIdleTypeModel(user_id, idleType);
};