export interface successMessage {
    statusCode : number;
    customCode : String;
    user_id? : number;
    instagram_id? : String;
    message : String;
};

export interface errorMessage {
    statusCode : number;
    customCode : String;
    message : String;
};

export const frontError : Record<string, errorMessage> = {
    serverError : { statusCode : 500, customCode : "EC500", message : "서버 에러입니다." },
    notSignUp : { statusCode : 400, customCode : "EC400", message : "회원 정보를 입력하지 않은 유저입니다." },
    unAuthorized : { statusCode : 401, customCode : "EC401", message : "인증 오류, 토큰이 존재하지 않습니다." },
    forbidden : { statusCode : 403, customCode : "EC403", message : "만료된 토큰입니다." },
    missingField : { statusCode : 400, customCode : "EC404", message : "누락값이 존재합니다." },
    signUpFaild : { statusCode : 400, customCode : "EC410", message : "회원가입에 실패하였습니다." },
    rerollCount : { statusCode : 400, customCode : "EC411", message : "리롤 횟수를 모두 소진하였습니다."},
    notFoundIdeal : {statusCode : 400, customCode : "EC412", message : "이상형을 찾지 못 했습니다."},
    alreadySignUp : {statusCode : 400, customCode : "EC413", message : "이미 회원가입을 한 유저입니다."}
};

export const frontSuccess : Record<string, successMessage> = {
    operationSuccess : { statusCode : 200, customCode : "SS200", message : "정상적으로 회원가입이 완료된 유저입니다."},
    singUpSuccess : { statusCode : 200, customCode : "SS201", message : "정상적으로 회원가입이 완료된 유저입니다."},
    matchSuccess : { statusCode : 200, customCode : "SS202",message : "매칭이 완료되었습니다."},
};