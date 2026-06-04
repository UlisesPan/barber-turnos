export interface ICredentialsDto {
    username: string;
    password: string;
}

export interface ICredentials extends ICredentialsDto {
    id: number;
}