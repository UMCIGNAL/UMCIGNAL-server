import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DATABASE_HOST, 
  user: process.env.DATABASE_USERNAME, 
  password: process.env.DATABASE_PASSWORD, 
  database: process.env.DATABASE_NAME, 
  port: Number(process.env.DATABASE_PORT), 
});

export const getPool = () => pool;
  
