import { IAccessory } from "./Accessory.interface";

export interface IUserData{
    loginToken: string;
    username: string;
    profilePicture: IAccessory;
    profileBoarder: IAccessory;
    stayLoggedIn: boolean;
}

export interface IUser extends IUserData{
    id:number;
}