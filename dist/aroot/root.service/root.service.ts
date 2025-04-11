import { getRerollCountModel } from "../root.model/root.model";

export const getRerollCountService = async (
    user_id : number
):Promise<void> => {
    console.log("Service");
    await getRerollCountModel(user_id);
};  