// register-response.dto.ts
export class RegisterResponseDTO {
    email: string
    message: string | null
    activation_code: number

    constructor(email: string, message: string | null,
        activation_code: number) {
        this.email = email;
        this.message = message;
        this.activation_code = activation_code
    }
}
