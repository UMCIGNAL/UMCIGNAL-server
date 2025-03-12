import { getPool } from "../../config/database/mysqlConnect";
import { ResultSetHeader } from "mysql2";
import { generateToken } from "../../security/JWT/secure.jwt";
import { UserDto } from "../user.dto/user.dto";

export const sendMailModel = async (
    email: string,
    verficationCode: string
):Promise<number> => {
    const pool = await getPool();

    const student_id = email.split('@')[0]; // 앞에 자리 파싱

    // 이미 가입된 학생인지 확인 (학번으로 check)
    const check_student_id = 
    `SELECT * FROM User WHERE student_id = ?`;

    const [checkResult]:any = await pool.query(check_student_id, [student_id]);

    // 이미 존재하는 User의 경우
    if(checkResult.length > 0) {
        // 인증 비번만 변경
        const update_validation_code =
        `UPDATE User SET valid_key = ? WHERE student_id = ?`;

        const change_validation_code = await pool.query(update_validation_code, [verficationCode, student_id]);

        return checkResult[0].user_id;
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

    const query = 
    `SELECT * FROM User WHERE valid_key = ?`;

    const [result]:any = await pool.query(query, [mailVerification]);

    if (result.length === 0) {
        return null; // 유효한 인증 코드가 없는 경우
    }

    const token = generateToken(result[0]); // JWT 토큰 생성
    return token;
};


export const userSignupModel = async (
    info : UserDto,
    user_id : number
): Promise<UserDto> => {
    const pool = await getPool();

    const query = `
        UPDATE User 
        SET gender = ?, 
            student_major = ?, 
            MBTI = ?, 
            is_smoking = ?, 
            is_drinking = ?, 
            instagram_id = ?, 
            updated_at = ? 
        WHERE user_id = ?
    `;

    const [insertResult] = await pool.query<ResultSetHeader>(query, [
        info.gender,
        info.student_major,
        info.MBTI,
        info.is_smoking,
        info.is_drinking,
        info.instagram_id,
        new Date(),
        user_id
    ]);

    const updatedQuery = 
    `SELECT * FROM User WHERE user_id = ?`;

    const [result]:[any[], any] = await pool.query(updatedQuery, [user_id]);

    const user = result[0] as UserDto;
    
    return user;
};