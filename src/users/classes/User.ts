export class User{
    id: number;
    username: string;
    isGuest: boolean;
    token: string;
    socketId?: string;

    constructor(id: number, username: string, isGuest: boolean, token: string){
        this.id = id;
        this.username = username;
        this.isGuest = isGuest;
        this.token = token;
        this.socketId = undefined;
    }
}