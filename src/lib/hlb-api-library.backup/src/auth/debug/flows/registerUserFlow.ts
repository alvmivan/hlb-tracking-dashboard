import {UserData} from "../../domain/userData";
import {registerUser, userExists} from "../../domain/userServices";
import {eraseBackend, prepareConfig} from "../../../shared/testUtils";


const testUser = new UserData("marcosperez", "Marcos", "Perez", "marcosperez@gmail.com", "admin", 34_567_891, "pass123");
const testUser2 = new UserData("dariofernandez", "Dario", "Fernandez", "dariofernandez@gmail.com", "user", 12_345_678, "pass123");


export const registerUserFlow = async () => {
    prepareConfig();
    await eraseBackend();
    
    if (!await userExists(testUser.userName)) {
        await registerUser(testUser);
    }

    if (!await userExists(testUser2.userName)) {
        await registerUser(testUser2);
    }
}
