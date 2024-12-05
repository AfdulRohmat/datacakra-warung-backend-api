export class LoginResponseDto {
    username: string;
    email: string;
    access_token: string;

    constructor(username: string, email: string, accessToken: string) {
        this.username = username;
        this.email = email;
        this.access_token = accessToken;
    }
}
