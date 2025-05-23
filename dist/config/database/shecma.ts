const Gender = {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other'
};

const DrinkingStatus = {
    NONE: '1',
    LIGHT: '2',
    HEAVY: '3'
};

const User = {
    user_id: 0,
    idleType: null,
    nickName: '',
    student_id: '',
    gender: null,
    is_smoking: null,
    is_drinking: null,
    MBTI: null,
    student_major: null,
    instagram_id: null,
    created_at: new Date(),
    updated_at: null,
    deleted_at: null,
    valid_key: null,
    reroll: 5,
    instagram_reject: 0,
    age: 0,
    token: null // 사용자 인증 토큰 추가
};

// idleType 테이블 생성
const createIdleTypeTable = `
    CREATE TABLE IF NOT EXISTS idleType (
        idleType_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        idle_MBTI VARCHAR(255) NULL DEFAULT NULL,
        age_gap INT NULL DEFAULT NULL,
        smoking_idle BOOLEAN NOT NULL DEFAULT FALSE,
        drinking_idle INT NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
    );
`;

// idle_major 테이블 생성
const createIdleMajorTable = `
    CREATE TABLE IF NOT EXISTS idle_major (
        major_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        idleType_id INT NOT NULL,
        major_name ENUM(
            '공간환경학부', '공공인재학부', '가족복지학과', '국가안보학과', '국어교육과', '교육학과', '영어교육과', '수학교육과',
            '경제금융학부', '경영학부', '글로벌경영학과', '융합경영학과', '휴먼지능정보공학전공', '핀테크전공', '빅데이터융합전공',
            '스마트생산전공', '애니메이션전공', '컴퓨터과학전공', '전기공학전공', '게임전공', '지능IOT융합전공', '한일문화콘텐츠전공',
            '생명공학전공', '화학에너지공학전공', '화공신소재전공', '식품영양학전공', '의류학전공', '스포츠건강관리전공',
            '무용예술전공', '조형예술전공', '생활예술전공', '음악학부'
        ) NOT NULL,
        FOREIGN KEY (idleType_id) REFERENCES idleType(idleType_id) ON DELETE CASCADE
    );
`;

const Colleges = [
    { id: 1, name: '인문사회과학대학' },
    { id: 2, name: '사범대학' },
    { id: 3, name: '경영경제대학' },
    { id: 4, name: '융합공과대학' },
    { id: 5, name: '문화예술대학' }
];

const Majors = [
    { id: 1, name: '공간환경학부', collegeId: 1 },
    { id: 2, name: '공공인재학부', collegeId: 1 },
    { id: 3, name: '가족복지학과', collegeId: 1 },
    { id: 4, name: '국가안보학과', collegeId: 1 },
    { id: 5, name: '국어교육과', collegeId: 2 },
    { id: 6, name: '교육학과', collegeId: 2 },
    { id: 7, name: '영어교육과', collegeId: 2 },
    { id: 8, name: '수학교육과', collegeId: 2 },
    { id: 9, name: '경제금융학부', collegeId: 3 },
    { id: 10, name: '경영학부', collegeId: 3 },
    { id: 11, name: '글로벌경영학과', collegeId: 3 },
    { id: 12, name: '융합경영학과', collegeId: 3 },
    { id: 13, name: '휴먼지능정보공학전공', collegeId: 4 },
    { id: 14, name: '핀테크전공', collegeId: 4 },
    { id: 15, name: '빅데이터융합전공', collegeId: 4 },
    { id: 16, name: '스마트생산전공', collegeId: 4 },
    { id: 17, name: '애니메이션전공', collegeId: 4 },
    { id: 18, name: '컴퓨터과학전공', collegeId: 4 },
    { id: 19, name: '전기공학전공', collegeId: 4 },
    { id: 20, name: '게임전공', collegeId: 4 },
    { id: 21, name: '지능IOT융합전공', collegeId: 4 },
    { id: 22, name: '한일문화콘텐츠전공', collegeId: 4 },
    { id: 23, name: '생명공학전공', collegeId: 4 },
    { id: 24, name: '화학에너지공학전공', collegeId: 4 },
    { id: 25, name: '화공신소재전공', collegeId: 4 },
    { id: 26, name: '식품영양학전공', collegeId: 5 },
    { id: 27, name: '의류학전공', collegeId: 5 },
    { id: 28, name: '스포츠건강관리전공', collegeId: 5 },
    { id: 29, name: '무용예술전공', collegeId: 5 },
    { id: 30, name: '조형예술전공', collegeId: 5 },
    { id: 31, name: '생활예술전공', collegeId: 5 },
    { id: 32, name: '음악학부', collegeId: 5 }
];