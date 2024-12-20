import {UserData} from "../../domain/userData";
import {getCurrentUserData, loginUser, registerUser, userExists, validateSession} from "../../domain/userServices";
import {ErrorData} from "../../../shared/connectionUtils";
import {just, Maybe} from "../../../maybeMonad/Maybe";

const testUser = new UserData("marcosperez", "Marcos", "Perez", "marcosperez@gmail.com", "admin", 34_567_891, "pass123");


export const loginUserFlow = async () => {


    //create the user
    if (!await userExists(testUser.userName)) {
        await registerUser(testUser);
    }


    const data: "ok" | ErrorData = await loginUser(testUser.userName, testUser.password);
    if (data == "ok") {
        console.log("login successful : SessionData :", data);
    } else {
        console.log("login failed : details :", data.details);
    }


    const isSessionValid = await validateSession();


    if (isSessionValid) {
        console.log("Session is valid");
    } else {
        console.log("Session is not valid");
    }


    const userData: Maybe<UserData> = await getCurrentUserData();

    userData.do((userData) => {
        //hacer cosas con el user data sabiendo que está presente
        console.log("User data: ", userData);
    })

    

}

