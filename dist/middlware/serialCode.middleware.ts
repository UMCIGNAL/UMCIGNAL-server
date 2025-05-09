import { getPool } from "../config/database/mysqlConnect";

export const getCode = async (
):Promise<void> => {
    const pool = await getPool();

    const query = `INSERT INTO serialCode
                   SET code = ?`;


    for(let i = 0; i < 100; i++) {
        const code = await generateReferralCode();

        console.log(code);
        await pool.query(query, [code]);
    }
};


// 추천인 코드 생성 6자리 문자 + 숫자 로직
export const generateReferralCode = async (
):Promise<string> => {
    const chars = 'bT10Ve7WwkFuySxRoY9Kmd3ljNtOpnZD4APMG65CL8JsvUhIfHEgXcar2BqizQ';
    let code = '';
    
    for(let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return  code;
};