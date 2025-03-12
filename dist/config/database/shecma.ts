type Gender = 'male' | 'female' | 'other';
type DrinkingStatus = '0' | '1' | '2';

export interface User {
    user_id: number;
    gender?: Gender | null; // Allowing null or undefined
    student_id?: string; // Allowing undefined or null
    student_major?: string; // Allowing undefined or null
    MBTI?: string; // Allowing undefined or null
    is_smoking?: boolean | null; // Allowing undefined or null
    is_drinking?: DrinkingStatus | null; // Allowing undefined or null
    instagram_id?: string; // Allowing undefined or null
    created_at?: Date; // Allowing undefined or null
    updated_at?: Date; // Allowing undefined or null
    deleted_at?: Date | null; // Allowing undefined or null
    valid_key?: string | null; // Allowing undefined or null
    reroll?: number | null; // Allowing undefined or null
}

export interface IdleType {
    user_id: number;
    MBTI?: string | null; // Allowing undefined or null
    age_gap: string;
    major_idle: string;
    is_smoking_idle?: boolean | null; // Allowing undefined or null
    is_drinking_idle?: string | null; // Allowing undefined or null
}

export interface Major {
    major_name: string;
}

export const majors: Major[] = [
    { major_name: '공간환경학부' },
    { major_name: '공공인재학부' },
    { major_name: '가족복지학과' },
    { major_name: '국가안보학과' },
    { major_name: '국어교육과' },
    { major_name: '교육학과' },
    { major_name: '영어교육과' },
    { major_name: '수학교육과' },
    { major_name: '경제금융학부' },
    { major_name: '경영학부' },
    { major_name: '글로벌경영학과' },
    { major_name: '융합경영학과' },
    { major_name: '휴먼지능정보공학전공' },
    { major_name: '핀테크전공' },
    { major_name: '빅데이터융합전공' },
    { major_name: '스마트산업전공' },
    { major_name: '애니메이션전공' },
    { major_name: '컴퓨터과학전공' },
    { major_name: '전기공학전공' },
    { major_name: '게임전공' },
    { major_name: '지능IoT융합전공' },
    { major_name: '한문문화콘텐츠전공' },
    { major_name: '생명공학전공' },
    { major_name: '화학에너지공학전공' },
    { major_name: '화공신소재전공' },
    { major_name: '식품영양학전공' },
    { major_name: '의학전공' },
    { major_name: '스포츠건강관리전공' },
    { major_name: '무용예술전공' },
    { major_name: '조형예술전공' },
    { major_name: '생활예술전공' },
    { major_name: '음악학부' }
];
