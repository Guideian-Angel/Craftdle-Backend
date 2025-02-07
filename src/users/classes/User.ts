export interface PasswordReset{
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

export interface AdminVerification{
    code: string;
    expiration: Date;
    verified: boolean;
}

export class User{
    id: number;
    username: string;
    isGuest: boolean;
    token: string;
    socketId?: string;
    passwordReset?: PasswordReset
    adminRights?: AdminRights
    adminVerification?: AdminVerification

    constructor(id: number, username: string, isGuest: boolean, token: string, adminRights: AdminRights){
        this.id = id;
        this.username = username;
        this.isGuest = isGuest;
        this.token = token;
        this.socketId = undefined;
        this.passwordReset = undefined;
        this.adminRights = adminRights;
        this.adminVerification = undefined;
    }
}