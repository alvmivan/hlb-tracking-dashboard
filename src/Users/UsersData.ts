﻿import {UserData} from "../lib/hlb-api-library/src/auth/domain/userData";
import {getUserData} from "../lib/hlb-api-library/src/auth/domain/userServices";
import {Maybe} from "../lib/hlb-api-library/src/maybeMonad/Maybe";
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
    if (!user.isNothing()) return user;

    return (await getUserData(userId))
        .doAsync(data => cacheUserData(data));

}