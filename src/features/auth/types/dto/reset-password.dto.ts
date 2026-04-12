export interface ResetPasswordDto {
    email: string;
    code: number;
    newPassword: string;
}
