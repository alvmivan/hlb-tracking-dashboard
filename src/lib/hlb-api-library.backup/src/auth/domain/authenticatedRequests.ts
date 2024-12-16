import {AppCache} from "../../shared/appContext";
import {HTTPMethod, globalFetch} from "../../shared/connectionUtils";


export const fetchAuthenticated = async (url: string, method: HTTPMethod, body: any) => {

    const hasSession = await AppCache.has("session");
    if (!hasSession) {
        console.error("Not authenticated");
        throw new Error("Not authenticated");
    }

    const {sessionId, userId} = await AppCache.get("session");

    if (!sessionId || !userId) {
        console.error("Not authenticated");
        throw new Error("Not authenticated");
    }

    return globalFetch(url, method, body, {userName: userId, authToken: sessionId});
     
};
