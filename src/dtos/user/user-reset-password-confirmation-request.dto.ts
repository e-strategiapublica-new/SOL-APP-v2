export abstract class UserResetPasswordConfirmationRequestDto {

        public email!: string;
        public code!: number;
        public newPassword!: string;

}