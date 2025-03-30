import { addIdleType, fixIdleType, foundUser } from "../idleType.dto/idleType.dto";
import { addIdleTypeModel, findIdleTypeModel, fixIdleTypeModel, rerollModel } from "../idleType.model/idleType.model";

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

export const findIdleTypeService = async(
    user_id:number
):Promise<{findUser : foundUser} | null> => {
    const result = await findIdleTypeModel(user_id);
    return result;
};

export const rerollService = async(
    user_id : number
):Promise<{findUser : foundUser} | null | number> => {
    const result = await rerollModel(user_id);

    return result;
};