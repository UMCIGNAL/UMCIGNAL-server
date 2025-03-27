import { getPool } from "../config/database/mysqlConnect";

// 이미 존재하는 회원인지 체크하는 함수
export const checkUser = async (
    student_id : string
):Promise<boolean> => {
    const pool = await getPool();

    const check_student_id = 
    `SELECT * FROM user WHERE student_id = ?`;

    const [checkResult]:any = await pool.query(check_student_id, [student_id]);

    // 이미 존재하는 회원
    if(checkResult.length > 0) {
        return true;
    }

    return false;
};



// 회원탈퇴를 위한 함수
export const softDelete = async (
    user_id : number
): Promise<boolean> => {
    const pool = await getPool();

    console.log('user_id:', user_id);
    
    const query = `
        SELECT deleted_at FROM user WHERE user_id = ?
    `;

    const result = await pool.query(query, [user_id]);

    // deleted_at이 null인 경우 아직 회원탈퇴를 하지 않은 회원임
    if(result[0] === null) {
        return false;
    }

    //만약 회원탈퇴한 회원인 경우
    return true;
};


// signOut을 위한 함수
export const check_jwt = async (
    token : string
): Promise<void> => {
    const pool = await getPool();


    // token을 null 값으로 처리하여 로그아웃 처리
    const query = `
        UPDATE Token SET null WHERE token = ?;
    `;

    await pool.query(query, [token]);
};

// Token 비교 함수
export const check_token = async (
    user_id : number
): Promise<boolean> => {
    const pool = await getPool();

    const query = `
        SELECT Token FROM user WHERE user_id = ?;
    `;

    const [result]:any = await pool.query(query, [user_id]);

    // 없다면 회원탈퇴 또는 로그아웃한 유저
    if(result[0].Token === 'notExsistToken' || result[0].Token === null) {
        return false;
    }
    // 로그인 한 유저
    return true;
};


export const come_back_user = async (
    student_id: string
): Promise<boolean> => {
    const pool = await getPool();

    const query = `
        SELECT Token FROM user WHERE student_id = ?;
    `;

    const [rows] = await pool.query(query, [student_id]);
    
    const user = rows as Array<any>;
    
    if (user.length > 0 && user[0].token === 'notExsistToken') {
        return true;
    }
    
    return false;
};