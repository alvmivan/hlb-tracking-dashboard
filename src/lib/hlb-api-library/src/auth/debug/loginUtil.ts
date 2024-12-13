import {loginUser, registerUser, userExists} from "../domain/userServices";
import {UserData} from "../domain/userData";

const sure = new UserData("marcosperez", "Marcos", "Perez", "marcosperez@gmail.com", "admin", 34_567_891, "pass123");

export async function testAuth(testUser: UserData | undefined = undefined) {
    testUser = testUser || sure;
    if (!await userExists(testUser.userName)) {
        await registerUser(testUser);
    }
    await loginUser(testUser.userName, testUser.password);
}