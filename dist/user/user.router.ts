import express from 'express';
import { changeUserInfoController, getMyInstController, mailVerifyController, mailVerifyStudentIdController, sendMailCodeController, userLogOutController, userSignOutController, userSignupController, userWhoCameBackController } from './user.controller/user.controller';
import { authenticateToken } from '../security/JWT/auth.jwt';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'user router' });
});

router.post('/mailCode', sendMailCodeController); // 처음 로그인 시 사용 또는 다시 로그인 시도 시 사용
router.post('/verify', mailVerifyController);   // 인증 코드 검증 및 토큰 발급
router.post('/verifyStudentId', mailVerifyStudentIdController);   // 인증 코드 검증 및 토큰 발급
router.patch('/signup', authenticateToken, userSignupController); // 이미 가입한 회원 초기 정보 입력 

router.patch('/logOut', authenticateToken, userLogOutController); // 로그아웃 처리
router.patch('/signOut', authenticateToken, userSignOutController); // 회원탈퇴 처리
// router.patch('/comebackUser', userWhoCameBackController); // 탈퇴한 회원 복구 처리 -> 필요 없음 기존 /mailCode 사용 가능
router.patch('/changeInfo', authenticateToken, changeUserInfoController); // 회원 정보 수정
router.get('/getMyIns', authenticateToken, getMyInstController);

/**
 * @swagger
 * /user/mailCode:
 *   post:
 *     summary: 이메일을 통한 인증 코드 전송
 *     description: 상명대학교 이메일 sangmyung.kr 또는 gmail.com 이메일을 통한 인증 코드 전송
 *     tags:
 *       - Verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *                 example: "본인학번@sangmyung.kr"
 *     responses:
 *       200:
 *         description: Mail sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "1"
 *                 message:
 *                   type: string
 *                   example: "메일 전송 완료"
 *       400:
 *         description: Invalid email format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이메일 형식이 올바르지 않습니다."
 *       201:
 *         description: Email already registered but needs reactivation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "기존 회원 복구 및 인증코드를 재전송하였습니다."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 내부 오류 발생"
 */

/**
 * @swagger
 * /user/verify:
 *   post:
 *     summary: 이메일 인증 코드 검증 및 토큰 발급
 *     description: 사용자가 제공한 이메일 인증 코드를 검증합니다.
 *     tags:
 *       - Verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mailVerification:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 메일 인증 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "메일 인증 완료"
 *                 token:
 *                   type: string
 *                   example: "your_generated_token"
 *       400:
 *         description: 인증 코드가 제공되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증 코드가 제공되지 않았습니다."
 *       408:
 *         description: 인증 코드가 6자리가 아님
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증 코드는 6자리여야 합니다."
 *       401:
 *         description: 인증 코드가 올바르지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증 코드가 올바르지 않습니다. 다시 인증해주세요."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 오류가 발생했습니다."
 */


/**
 * @swagger
 * /user/signup:
 *   patch:
 *     summary: 사용자 회원가입 후 초기 정보 입력 <신규 회원에게만 적용할 것!!!>
 *     description: 사용자가 Mail의 검증이 끝났다면 회원 정보를 수정합니다. - 기존 회원이면 넘어가도 상관 없습니다.
 *     tags:
 *       - Verification
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gender:
 *                 type: string
 *                 example: "male"
 *               name:       
 *                 type: string  
 *                 example: "고명준"   
 *               student_major:
 *                 type: string
 *                 example: "컴퓨터과학과"
 *               MBTI:
 *                 type: string
 *                 example: "ESTJ"
 *               is_smoking:
 *                 type: boolean
 *                 example: false
 *               is_drinking:
 *                 type: number
 *                 example: 1
 *               instagram_id:
 *                 type: string
 *                 example: "wwnnss06"
 *               age :
 *                 type: number
 *                 example: 2001-06-01
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원가입 성공"
 *                 data:
 *                   type: object
 *                   description: 회원가입된 사용자 데이터
 *       400:
 *         description: 필수 입력값 누락 또는 잘못된 값
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수 입력값이 누락되었습니다."
 *                 missingFields:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["gender", "student_major"]
 *       401:
 *         description: 인증되지 않은 요청 (토큰이 없거나 유효하지 않음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰이 유효하지 않습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 오류가 발생했습니다."
 */

/**
 * @swagger
 * /user/logOut:
 *   patch:
 *     summary: 사용자 로그아웃
 *     description: 사용자가 로그아웃을 하면, 서버에서 인증 토큰을 삭제하고 로그아웃 처리를 합니다.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: [] 
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그아웃 성공"
 *       401:
 *         description: 인증되지 않은 사용자 (유효하지 않거나 존재하지 않는 토큰)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰이 유효하지 않습니다."
 *       404:
 *         description: 요청에 토큰이 포함되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰이 없습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 오류가 발생했습니다."
 */


/**
 * @swagger
 * /user/signOut:
 *   patch:
 *     summary: 사용자 회원탈퇴
 *     description: 사용자가 회원탈퇴 요청을 하면, 해당 사용자의 데이터를 5일 뒤에 삭제합니다.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: [] 
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: 회원탈퇴 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원탈퇴 성공 5일 뒤에 데이터가 삭제됩니다."
 *       401:
 *         description: 인증되지 않은 사용자 (유효하지 않거나 존재하지 않는 토큰)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰이 유효하지 않습니다."
 *       404:
 *         description: 요청에 토큰이 포함되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰이 없습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 오류가 발생했습니다."
 */


/**
 * @swagger
 * /user/changeInfo:
 *   patch:
 *     summary: "회원 정보 수정"
 *     description: "사용자가 자신의 MBTI, 흡연 여부, 음주 여부, 인스타그램 아이디를 수정합니다."
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - MBTI
 *               - is_smoking
 *               - is_drinking
 *               - instagram_id
 *             properties:
 *               MBTI:
 *                 type: string
 *                 description: "사용자의 MBTI (예: 'INTP')"
 *                 example: "INTP"
 *               is_smoking:
 *                 type: boolean
 *                 description: "흡연 여부 (true: 흡연, false: 비흡연)"
 *                 example: true
 *               is_drinking:
 *                 type: boolean
 *                 description: "음주 여부 (1 : 안마심, 2 : 1병 미만, 3 : 1병 이상)"
 *                 example: 1
 *               instagram_id:
 *                 type: string
 *                 description: "사용자의 인스타그램 아이디"
 *                 example: "wwnnss08"
 *     responses:
 *       200:
 *         description: "회원 정보 변경 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원 정보가 변경이 완료되었습니다."
 *       400:
 *         description: "필수 입력값이 누락된 경우"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수 입력값이 누락되었습니다."
 *                 missingFields:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["MBTI", "instagram_id"]
 *       401:
 *         description: "인증 실패 (토큰 없음 또는 로그인되지 않음)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인 되어있지 않습니다."
 *       403:
 *         description: "잘못된 토큰"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰이 유효하지 않습니다."
 *       404:
 *         description: "토큰이 제공되지 않음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰이 없습니다."
 *       500:
 *         description: "서버 오류"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 오류가 발생했습니다."
 */


/**
 * @swagger
 * /user/getMyIns:
 *   get:
 *     summary: "사용자의 인스턴스 정보를 가져옵니다."
 *     description: "로그인된 사용자의 인스턴스 정보를 반환합니다."
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "인스턴스 정보 조회 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   description: "인스턴스 정보 배열"
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: wwnnss06
 *       401:
 *         description: "인증 실패"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: "토큰 없음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */


/**
 * @swagger
 * /user/verifyStudentId:
 *   post:
 *     summary: 학생 메일 인증 코드 검증 및 토큰 발급
 *     description: 클라이언트에서 받은 인증 코드와 학번을 검증하여 성공 시 토큰을 발급합니다.
 *     tags:
 *       - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mailVerification
 *               - student_id
 *             properties:
 *               mailVerification:
 *                 type: string
 *                 example: "123456"
 *                 description: 인증 메일로 받은 6자리 코드
 *               student_id:
 *                 type: string
 *                 example: "202312345"
 *                 description: 사용자의 학번
 *     responses:
 *       200:
 *         description: 인증 성공 및 토큰 발급
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "메일 인증 완료"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: 인증 코드 또는 학번 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증 코드가 제공되지 않았습니다."
 *       403:
 *         description: 잘못된 인증 코드
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증 코드가 올바르지 않습니다. 다시 인증해주세요."
 *       408:
 *         description: 인증 코드가 6자리가 아님
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증 코드는 6자리입니다."
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 오류가 발생했습니다."
 */

export default router;