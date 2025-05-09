import mysql from 'mysql2/promise';
import { Client } from 'ssh2';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const sshClient = new Client();
let pool: mysql.Pool;
export const pool = mysql.createPool({
  host: process.env.DATABASE_HOST, 
  user: process.env.DATABASE_USERNAME, 
  password: process.env.DATABASE_PASSWORD, 
  database: process.env.DATABASE_NAME, 
  port: Number(process.env.DATABASE_PORT), 
});

export const getPool = () => pool;
