import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = async (member: any): Promise<string> => {
    try {
      const token = await new Promise<string>((resolve, reject) => {
        jwt.sign(
          {
            user_id: member.user_id,
            student_id: member.student_id,
          },
          process.env.JWT_SECRET as string, // 환경변수에서 JWT_SECRET 가져오기 
          {
            expiresIn: '2d', // 유효 기간 설정
          },
          (err, token) => {
            if (err) {
              reject(err); // 오류 처리
            } else {
              resolve(token as string); // 성공적으로 토큰을 반환
            }
          }
        );
      });
      return token;
    } catch (error) {
      throw new Error('Token generation failed: ' + error);
    }
  };
