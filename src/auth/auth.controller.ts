import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest } from './dto/auth.request';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post("signup")
    signUp(@Body() body: AuthRequest) {
        const { email, password } = body;

        return this.authService.signUp(email, password);
    }

    @Post("signin")
    signIn(@Body() body: AuthRequest) {
        const { email, password } = body;

        return this.authService.signIn(email, password);
    }
}
