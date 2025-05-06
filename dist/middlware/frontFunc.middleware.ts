import { idealInfo } from "../frontFunc/frontFunc.DTO/frontFunc.DTO";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { addFoundUserTable, duplicateUser, findIdleTypeInTable, makeRandomIndex, rerollCount } from "./idleType.middleware";
import { PoolConnection } from "mysql2/promise";

export const frontReroll = async (
    gender: String,
    user_id: number,
    conn: PoolConnection
): Promise<{ findUser: idealInfo } | number | null> => {
    try {
        const findIdleQuery = `
            SELECT instagram_id, user_id
            FROM user
            WHERE gender = ?;
        `;

        // pool.query 대신 conn.query 사용
        const [idleArray]: any = await conn.query<RowDataPacket[]>(findIdleQuery, [gender]);
        console.log("Found users count:", idleArray.length);

        if (idleArray.length === 0) {
            return null;
        }

        let idle_user: any;
        let isDuplicate: boolean;
        let isSignUp: boolean;
        let attempts = 0;
        const MAX_ATTEMPTS = 15; // 무한 루프 방지

        const chanceToReroll = await rerollCount(user_id, conn);

        if (chanceToReroll > 0) {
            do {
                const index = idleArray.length > 0 ? makeRandomIndex(idleArray.length) : -1;
                if (index === -1) break;

                idle_user = idleArray[index];
                const idle_UserId = idle_user.user_id;  // 여기서 할당

                // 비동기 처리 개선
                [isDuplicate, isSignUp] = await Promise.all([
                    duplicateUser(user_id, idle_UserId, conn),
                    checkSignUp(idle_UserId, conn)
                ]);

                attempts++;
                if (attempts >= MAX_ATTEMPTS && (isDuplicate || isSignUp)) {
                    const duplicateUserResult = await FrontfindIdleTypeInTable(user_id, conn);

                    if (duplicateUserResult && typeof duplicateUserResult === 'object' && 'findUser' in duplicateUserResult) {
                        const duplicateUser = duplicateUserResult.findUser;
                        await conn.release(); // 커넥션 반환
                        return {
                            findUser: duplicateUser,
                        };
                    }

                    await conn.release(); // 커넥션 반환
                    return duplicateUserResult;
                }
            } while (isDuplicate || isSignUp);

            const foundUser: idealInfo = {
                instagram_id: idle_user.instagram_id,
            };

            await addFoundUserTable(user_id, idle_user.user_id, conn);
            await conn.release(); // 커넥션 반환

            return { 
                findUser: foundUser,
            };
        } else {
            await conn.release(); // 리롤 기회 소진 시 커넥션 반환
            return chanceToReroll;
        }
    } catch (error : any) {
        console.error("Error in reroll:", error.message || error);
        throw error;
    }
};


// 찾아진 이상형 테이블에서 찾는 함수
const FrontfindIdleTypeInTable = async (
    user_id : number,
    conn : PoolConnection
):Promise<{ findUser: idealInfo }> => {
    const friend_result = `SELECT friend_id FROM found_User WHERE user_id =?;`;

    const [result]:any = await conn.query(friend_result, [user_id]);

    const index = makeRandomIndex(result.length); // 배열 값에서 랜덤으로 index 생성

    const idle_duplicate = result[index].friend_id; // index에서 이미 찾은 친구 id를 반환

    const findIdleQuery = `
            SELECT instagram_id
            FROM user
            WHERE user_id = ?;
        `;

    const [findResult]:any = await conn.query(findIdleQuery, [idle_duplicate]);
        
    const foundUser: idealInfo = {
        instagram_id: findResult[0].instagram_id,
    };

    return { findUser: foundUser };
};


const checkSignUp = async(
    idle_user_id: number,
    conn: PoolConnection
): Promise<boolean> => {
    const query = `SELECT signUpComplete FROM user WHERE user_id = ?;`;

    try {
        const [useQuery]: any = await conn.query(query, [idle_user_id]);

        // 쿼리 결과가 없을 경우 처리
        if (!useQuery || useQuery.length === 0) {
            console.error(`User with user_id ${idle_user_id} not found in the database.`);
            return false; // 데이터가 없으면 false 반환 (가입 상태를 알 수 없으므로 false로 간주)
        }

        const check = useQuery[0].signUpComplete;

        console.log("signUpComplete value:", check);

        if (check === 1) {
            return false; // 이미 입력한 경우
        } else {
            return true; // 입력 안 한 경우
        }
    } catch (error : any) {
        console.error("Error in checkSignUp:", error.message || error);
        throw error;
    }
  };