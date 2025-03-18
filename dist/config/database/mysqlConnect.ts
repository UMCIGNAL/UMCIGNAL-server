import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line import/prefer-default-export
export const pool = mysql.createPool({
  host: process.env.DATABASE_HOST, // SSH 터널을 통해 로컬로 리디렉션되므로 localhost 사용
  user: process.env.DATABASE_USERNAME, // 데이터베이스 사용자 이름
  password: process.env.DATABASE_PASSWORD, // 데이터베이스 비밀번호
  database: process.env.DATABASE_NAME, // 데이터베이스 이름
  port: Number(process.env.DATABASE_PORT), // 로컬 포워딩 포트
});

export const getPool = () => pool;