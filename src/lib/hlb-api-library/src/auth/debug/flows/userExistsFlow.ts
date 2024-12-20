import {UserData} from "../../domain/userData";
import {userExists} from "../../domain/userServices";

const testUser = new UserData("marcosperez","Marcos","Perez","marcosperez@gmail.com","admin",34_567_891,"pass123");
const testUser2 = new UserData("dariofernandez","Dario","Fernandez","dariofernandez@gmail.com","user",12_345_678,"pass123");

export const userExistsFlow = async () => {
    const exists1 = await userExists(testUser.userName);
    const exists2 = await userExists(testUser2.userName);
    const exists3 = await userExists(testUser.userName+"akjolds");
    
    
    console.log("(should be true) User exists: ", exists1);
    
    console.log("(should be true) User exists: ", exists2);
    console.log("(should be false) User exists: ", exists3);
    
}
