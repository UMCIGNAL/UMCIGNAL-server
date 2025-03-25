import {Request, Response, NextFunction} from 'express';
import { getPool } from '../config/database/mysqlConnect';
import { RowDataPacket } from 'mysql2';  

export const convertAge = async (
    date_of_birth : Date
):Promise<number> => {
    const today = new Date();
    const birthDate = new Date(date_of_birth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // 생일이 지나지 않았으면 한 살 빼기
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}

export const maleInfoAdd = async (
    user_id : number,
):Promise<number> => {
    const pool = await getPool();

    if(user_id === null) {
        return 0;
    }

    const query = 
    `INSERT INTO male_table (user_id) VALUES (?)`; 

    await pool.query(query, [user_id]);

    return 1;   
};

export const femaleInfoAdd = async (
    user_id : number
):Promise<number> => {
    const pool = await getPool();

    if(user_id === null) {
        return 0;
    }

    const query = 
    `INSERT INTO female_table (user_id) VALUES (?)`;

    await pool.query(query, [user_id]);

    return 1;
};


// soft delete을 위한 함수
export const findGender = async (
    user_id: number
): Promise<void> => {
    const pool = await getPool();

    const query = 
    `SELECT gender FROM user WHERE user_id = ?`;

    const [rows] = await pool.query<RowDataPacket[]>(query, [user_id]);

    const gender = rows[0].gender;

    if(gender === 'male') {
        const queryGender = `
        UPDATE male_table 
        SET soft_delete = ?
        WHERE user_id = ?
        `;

        await pool.query(queryGender, [true, user_id]);

    } else if(gender === 'female') {
        const queryGender = `
        UPDATE female_table 
        SET soft_delete = ?
        WHERE user_id = ?
        `;

        await pool.query(queryGender, [true, user_id]);  
    }
};


// 다시 유저 검색 복구 로직
export const genderRecovery = async (
    student_id : string
):Promise<void> => {
    const pool = await getPool();

    const query = 
    `SELECT gender FROM user WHERE student_id = ?`;

    const [rows] = await pool.query<RowDataPacket[]>(query, [student_id]);

    const gender = rows[0].gender;

    const queryUserId =
    `SELECT user_id FROM user WHERE student_id = ?`;

    const [rowsUserId] = await pool.query<RowDataPacket[]>(queryUserId, [student_id]);

    const user_id = rowsUserId[0].user_id;

    if(gender === 'male') {
        const queryGender = `
        UPDATE male_table 
        SET soft_delete = ?
        WHERE user_id = ?
        `;

        await pool.query(queryGender, [false, user_id]);
    } else if(gender === 'female') {
        const queryGender = `
        UPDATE female_table 
        SET soft_delete = ?
        WHERE user_id = ?
        `;

        await pool.query(queryGender, [false, user_id]);  
    }
};