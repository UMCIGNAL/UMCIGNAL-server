import { deleteUserModel, getRerollCountModel } from "../root.model/root.model";

export const getRerollCountService = async (
    user_id : number
):Promise<void> => {
    console.log("Service");
    await getRerollCountModel(user_id);
};  

export const deleteUserService = async (
    user_id : number
):Promise<void> => {
    await deleteUserModel(user_id);
};