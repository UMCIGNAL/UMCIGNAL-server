import { generateCode, sendEmail } from "../../security/mail/mail.sender";
import { changeUserInfoModel, mailVerifyModel, sendMailModel, userLogOutModel, userSignOutModel, userSignupModel } from "../user.model/user.model";
import { userChangeInfoDTO, UserDto } from "../user.dto/user.dto";


export const sendMailCodeService = async (
    email : string
): Promise<number> => {
    // 코드 생성성
    const verficationCode = await generateCode();

    await sendEmail(email, verficationCode);
    console.log(`Verification code for ${email}: ${verficationCode}`);

    const user_id = await sendMailModel(email, verficationCode);

    return user_id;
};

export const mailVerifyService = async (
    mailVerification : string
): Promise<string | null> => {
    // 인증 코드 검증
    const token = await mailVerifyModel(mailVerification);
    return token;
};


export const userSignupService = async (
    info : UserDto,
    user_id : number
): Promise<UserDto> => {
    const result = await userSignupModel(info, user_id);

    return result;
};


export const userLogOutService = async (
    token : string
): Promise<void> => {
    const result = await userLogOutModel(token);
};

export const userSignOutService = async (
    user_id : number 
): Promise<void> => {
    const result = await userSignOutModel(user_id);
};

export const changeUserInfoService = async (
    user_id : number,
    userInfo : userChangeInfoDTO
): Promise<void> => {
    await changeUserInfoModel(user_id, userInfo);
};