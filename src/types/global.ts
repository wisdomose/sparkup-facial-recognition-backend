import { User } from "../res/user/user.model";

export type UserLocal = Omit<User, "descriptor">;
