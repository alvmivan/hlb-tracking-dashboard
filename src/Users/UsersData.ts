import {UserData} from "hlb-api-library/src/auth/domain/userData.ts";
import {getUserData} from "hlb-api-library/src/auth/domain/userServices.ts";
import {Maybe} from "hlb-api-library/src/maybeMonad/Maybe";
import {LocalCache} from "../LocalCache/LocalCache.ts";

let cache: LocalCache<string, UserData>;

export const initUsersCacheStep = {
    name: "Initialize Users Cache",
    action: async () => {
        cache = await LocalCache.findOrCreate<string, UserData>("userData")
    }
}

async function cacheUserData(userData: UserData): Promise<void> {
    await cache.set(userData.userName, userData);
}

export const fetchUserData = async (userId: string): Promise<Maybe<UserData>> => {
    let user: Maybe<UserData> = cache.get(userId);
    if (user.isNothing()) {
        user = await getUserData(userId);
    }
    return user
        .doAsync(data => cacheUserData(data))
        .do(data => console.log("User data to cache: ", data));
}