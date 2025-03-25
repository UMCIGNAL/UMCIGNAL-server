
export const convertAge = async (
    date_of_birth : Date
):Promise<number> => {
    const today = new Date();
    const birthDate = new Date(date_of_birth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // 생일이 지나지 않았으면 한 살 빼기
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}