
// 상명대생 이메일 형식 검증
export const emailValidation = (email: string): boolean => {
    const emailRegex = /^\d{9}@sangmyung\.kr$/;
    return emailRegex.test(email);
};


// gamil 이메일 형식 검증
export const gmailValidation = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9]+@gmail\.com$/;
    return emailRegex.test(email);
};