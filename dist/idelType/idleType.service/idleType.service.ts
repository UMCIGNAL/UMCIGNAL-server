import { addIdleType, fixIdleType } from "../idleType.dto/idleType.dto";
import { addIdleTypeModel, fixIdleTypeModel } from "../idleType.model/idleType.model";

export const addIdleTypeService = async (
    user_id : number,
    idleType : addIdleType
): Promise<void> => {
    await addIdleTypeModel(user_id, idleType);
};

export const fixIdleTypeService = async(
    user_id : number,
    idleType : fixIdleType
):Promise<void> => {
    await fixIdleTypeModel(user_id, idleType);
};