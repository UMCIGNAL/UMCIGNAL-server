import nodemail from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// 코드 생성 함수
export const generateCode = async (
) => {
    let code = "";
    for(let i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}

// 이메일 전송 함수
export const transporter = nodemail.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_SECURITY
    }
});

// 이메일 전송 함수
export const sendEmail = async(
    email: string,
    code: string
) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'UMCignal 회원가입 인증 코드',
        text: `인증 코드: ${code}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            console.log(err);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
};