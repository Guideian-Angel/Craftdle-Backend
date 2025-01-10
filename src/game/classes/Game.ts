import { User } from "src/users/classes/user";
import { Riddle } from "./Riddle";
import { UsersService } from "src/users/users.service";

export class Game {
    riddle: Riddle;
    user: User;

    constructor(riddle: Riddle, userToken: string, usersService: UsersService) {
        this.riddle = riddle;
        this.user = usersService.getUserByToken(userToken);
    }

    toJSON() {
        return {
            riddle: this.riddle,
            user: this.user,
        };
    }
}