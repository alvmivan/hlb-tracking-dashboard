export class SessionData {
    sessionId: string;
    ip: string;
    userId: string;

    constructor(sessionId: string, ip: string, userId: string) {
        this.sessionId = sessionId;
        this.ip = ip;
        this.userId = userId;
    }
}