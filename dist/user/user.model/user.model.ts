import { getPool } from "../../config/database/mysqlConnect";
import { ResultSetHeader } from "mysql2";
import { generateToken } from "../../security/JWT/secure.jwt";
import { userChangeInfoDTO, UserDto } from "../user.dto/user.dto";
import { generateReferralCode } from "../../middlware/referralMiddleware";
import { checkUser } from "../../middlware/softDelete";

export const sendMailModel = async (
    email: string,
    verficationCode: string
):Promise<number> => {
    const pool = await getPool();

    const student_id = email.split('@')[0]; // 앞에 자리 파싱

    // 이미 가입된 학생인지 확인 (학번으로 check) // 미들웨어에서 처리하게 만들어
    const check_user = await checkUser(student_id);

    console.log('check_user:', check_user);

    // 이미 존재하는 User의 경우 -> 로그아웃 또는 회원탈퇴한 유저 대상
    if(check_user === true) {
        // 인증 비번만 변경
        const update_validation_code =
        `UPDATE User
         SET valid_key = ?,
         deleted_at = ?
         WHERE student_id = ?`;

        const change_validation_code = await pool.query(update_validation_code, [verficationCode, null, student_id]);

        return 0;
    }

    // 이메일 전송 후 DB에 저장
    const query = 
    `INSERT INTO User (student_id, valid_key, created_at) VALUES (?, ?, ?)`;


    // 인증 코드와 학번을 DB에 저장
    const [result] = await pool.query<ResultSetHeader>(query, [student_id, verficationCode, new Date()]);
    const user_id = result.insertId;

    return user_id;
};


export const mailVerifyModel = async (
    mailVerification: string
): Promise<string | null> => {
    const pool = await getPool();

    const query = `SELECT * FROM User WHERE valid_key = ?`;

    const [result]: any = await pool.query(query, [mailVerification]);

    if (result.length === 0) {
        return null; // 유효한 인증 코드가 없는 경우
    }

    const token = await generateToken(result[0]); // JWT 토큰 생성

    if (!token) {
        console.error('Token generation failed');
        return null;
    }

    console.log('Token generated:', token);

    const updateQuery = `UPDATE User SET Token = ? WHERE user_id = ?`;

    // 토큰 값과 user_id가 정확하게 들어왔는지 확인
    await pool.query(updateQuery, [token, result[0].user_id]);

    return token;
};



export const userSignupModel = async (
    info : UserDto,
    user_id : number
): Promise<UserDto> => {
    const pool = await getPool();

    const referral_code = await generateReferralCode(user_id);

    const query = `
        UPDATE User 
        SET gender = ?, 
            student_major = ?, 
            MBTI = ?, 
            is_smoking = ?, 
            is_drinking = ?, 
            instagram_id = ?, 
            age = ?,
            updated_at = ?,
            referralCode = ?
        WHERE user_id = ?
    `;

    const [insertResult] = await pool.query<ResultSetHeader>(query, [
        info.gender,
        info.student_major,
        info.MBTI,
        info.is_smoking,
        info.is_drinking,
        info.instagram_id,
        info.age,
        new Date(),
        referral_code,
        user_id
    ]);

    const updatedQuery = 
    `SELECT * FROM User WHERE user_id = ?`;

    const [result]:[any[], any] = await pool.query(updatedQuery, [user_id]);

    const user = result[0] as UserDto;
    
    return user;
};


export const userLogOutModel = async (
    token : string
): Promise<void> => {
    const pool = await getPool();

    const query = `
        UPDATE User 
        SET token = null
        WHERE token = ?
    `;

    await pool.query(query, [token]);
};


export const userSignOutModel = async (
    user_id : number
): Promise<void> => {
    const pool = await getPool();

    // 현재 날짜에서 5일 후의 날짜 계산
    const fiveDaysLater = new Date();
    fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);

    const query = `
        UPDATE User 
        SET deleted_at = ?, Token = ?
        WHERE user_id = ?
    `;

    await pool.query(query, [fiveDaysLater, 'notExsistToken', user_id]);
};



export const changeUserInfoModel = async (
    user_id : number,
    userInfo : userChangeInfoDTO
):Promise<void> => {
    const pool = await getPool();

    const query = `
        UPDATE User
        SET MBTI = ?,
            is_smoking = ?,
            is_drinking = ?,
            instagram_id = ?,
            updated_at = ?
        WHERE user_id = ?
        `;

    const [result]:any = await pool.query(query, [
        userInfo.MBTI,
        userInfo.is_smoking,
        userInfo.is_drinking,
        userInfo.instagram_id,
        new Date(),
        user_id
    ]);
};