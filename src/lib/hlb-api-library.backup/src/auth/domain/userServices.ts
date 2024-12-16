import {AppCache, AppConfig, getSettings} from "../../shared/appContext";
import {UserData} from "./userData";
import {SessionData} from "./sessionData";
import {encapsulateEitherError, ErrorData, handleError, sendGet, sendPost} from "../../shared/connectionUtils";
import {just, Maybe, maybeOf, nothing} from "../../maybeMonad/Maybe";
import {fetchAuthenticated} from "./authenticatedRequests";

const userCacheKey = "selfUser";
const sessionCacheKey = "session";

const getApiUrl = async (): Promise<string> => {
    return AppConfig.get("API_URL");
};

const ok = "ok";
type EitherOkError = Promise<"ok" | ErrorData>;

/**
 * Registers a new user by sending a POST request to the registration endpoint.
 *
 * @param {UserData} userData - The data of the user to be registered.
 * @returns {Promise<"ok" | ErrorData>} - A promise that resolves to "ok" if the registration is successful,
 *                                      or an ErrorData object if an error occurs.
 */
export const registerUser = async (userData: UserData): EitherOkError => {
    const ApiUrl = await getApiUrl();
    const REGISTER_USER_URL = `${ApiUrl}/users/register`;
    const response = await sendPost(REGISTER_USER_URL, userData);
    await handleError(response);
    return await encapsulateEitherError(response, ok);
}
/**
 * Checks if a user exists by sending a POST request to the user existence endpoint.
 *
 * @param {string} userName - The username to check for existence.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user exists, false otherwise.
 */
export const userExists = async (userName: string): Promise<boolean> => {
    const ApiUrl = await getApiUrl();
    const USER_EXISTS_URL = `${ApiUrl}/users/exists`;
    const response = await sendPost(USER_EXISTS_URL, {userName});
    await handleError(response);
    const {exists} = await response.json();
    return exists;
}
/**
 * Logs in a user by sending a POST request to the login endpoint.
 *
 * @param {string} userName - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<ok | ErrorData>} - A promise that resolves to "ok" if the login is successful,
 *                                      or an ErrorData object if an error occurs.
 */
export const loginUser = async (userName: string, password: string): EitherOkError => {
    const ApiUrl = await getApiUrl();
    const LOGIN_URL = `${ApiUrl}/users/login`;

    const response = await sendPost(LOGIN_URL, {userName, password});

    if (response.status === 401) {
        return {errorCode: 401, details: "Invalid username or password", isError: true};
    }


    const sessionData = await response.json();
    let session = new SessionData(sessionData.sessionId, sessionData.ip, sessionData.userId);
    await AppCache.set(sessionCacheKey, session);
    return await encapsulateEitherError(response, ok);
}

/**
 * Validates the current user session by sending a POST request to the session validation endpoint.
 *
 * @returns {Promise<boolean>} - A promise that resolves to true if the session is valid, false otherwise.
 */
export const validateSession = async (): Promise<boolean> => {
    const hasSession = await AppCache.has(sessionCacheKey);
    if (!hasSession) return false;

    const sessionData = await AppCache.get(sessionCacheKey);
    if (!sessionData) {
        await AppCache.remove(sessionCacheKey);
        return false;
    }

    const ApiUrl = await getApiUrl();
    const VALIDATE_SESSION_URL = `${ApiUrl}/users/validate-session`;

    const response = await sendPost(VALIDATE_SESSION_URL, sessionData);
    await handleError(response);

    const data: { isValid: boolean } = await response.json();
    return data.isValid;
}


/**
 * Fetches user data by sending a GET request to the user data endpoint.
 *
 * @param {string} userName - The username to fetch data for.
 * @returns {Promise<UserData | undefined | ErrorData>} - A promise that resolves to the user data if successful,
 *                                            or an ErrorData object if an error occurs.
 */
export const getUserData = async (userName: string): Promise<Maybe<UserData>> => {
    const ApiUrl = await getApiUrl();
    const GET_USER_DATA_URL = `${ApiUrl}/users/get-data/${userName}`;
    const response = await fetchAuthenticated(GET_USER_DATA_URL,"GET", undefined);
    if (response.status === 404) {
        return nothing();
    }
    await handleError(response);
    return maybeOf(await response.json());
}


/**
 * Get the info of the current logged user
 * @returns {Promise<UserData | undefined>} - A promise that resolves to the user data if successful,
 *                                           or undefined if an error occurs.
 *
 *
 */
export const getCurrentUserData = async (): Promise<Maybe<UserData>> => {


    const sessionData = await AppCache.get(sessionCacheKey);

    debugValue("session data")(sessionData);
    if (!sessionData) return nothing();

    if (await AppCache.has(userCacheKey)) {
        const cachedUser = await AppCache.get(userCacheKey);

        if (cachedUser) {
            debugValue("cached user")(cachedUser);
            return just(cachedUser);
        }
    }

    const userData: Maybe<UserData> = await getUserData(sessionData.userId);

    //catch and return
    return userData
        .do(debugValue("user data"))
        .filter((user: UserData) => user.userName === sessionData.userId)
        .do((user: UserData) => AppCache.set(userCacheKey, user).then());
}

const debugValue = (prefix: string) => (value: any) => {
    return getSettings().IsDebug && console.log(prefix + ": ", value);
};