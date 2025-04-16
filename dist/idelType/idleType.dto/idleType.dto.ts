export interface addIdleType {
    idle_MBTI : String;
    age_gap : number;
    smoking_idle : boolean;
    drinking_idle : number;
    major_idle : String[];
    sameMajor : boolean;
}

export interface fixIdleType {
    idle_MBTI : String;
    age_gap : number;
    smoking_idle : boolean;
    drinking_idle : number;
    major_idle : String[];
}

export interface foundUser {
    user_id : number;
    is_smoking : boolean;
    is_drinking : number;
    idle_MBTI : String;
    idle_major : String;
    instagram_id : String;
    idle_age : number;
}