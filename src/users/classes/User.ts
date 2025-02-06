interface PasswordReset{
    token: string;
    expiration: Date;
    images: Array<{
        id: number;
        item_id: string;
        name: string;
        src: string;
        isRight: boolean;
    }>;
    verified: boolean;
    email: string;
}

interface AdminRights{
    modifyUsers: boolean;
    modifyMaintenance: boolean;
    modifyAdmins: boolean;
}

export class User{
    id: number;
    username: string;
    isGuest: boolean;
    token: string;
    socketId?: string;
    passwordReset?: PasswordReset
    adminRights?: AdminRights

    constructor(id: number, username: string, isGuest: boolean, token: string, adminRights: AdminRights){
        this.id = id;
        this.username = username;
        this.isGuest = isGuest;
        this.token = token;
        this.socketId = undefined;
        this.passwordReset = undefined;
        this.adminRights = adminRights;
    }
}