export interface IUserData {
    name: string;
    email: string;
    birthdate: string;
    nDni: number;
    profilePhoto?: string;

}
export interface IUserDto extends IUserData {
    password: string;
}

export interface IUser extends IUserData {
    id: number;

}