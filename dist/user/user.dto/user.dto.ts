export interface UserDto {
    gender: string;
    student_major: string;
    MBTI: string;
    is_smoking: boolean;
    is_drinking: number;
    instagram_id : string;
    creadted_at: Date;
    updated_at: Date;
    age : number;
}


export interface userChangeInfoDTO {
    MBTI: string;
    is_smoking: boolean;
    is_drinking: number;
    instagram_id : string;
    updated_at: Date;
}