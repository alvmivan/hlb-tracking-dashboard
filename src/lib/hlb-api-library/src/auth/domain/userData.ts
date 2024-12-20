export class UserData {
    public readonly userName: string;
    public readonly name: string;
    public readonly lastName: string;
    public readonly email: string;
    public readonly role: string;
    public readonly dni: number;
    public readonly password: string;

    constructor(userName: string, name: string, lastName: string, email: string, role: string, dni: number, password: string) {
        this.userName = userName;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.dni = dni;
        this.password = password;
    }
}