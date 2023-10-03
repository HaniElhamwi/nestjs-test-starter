import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    // Generate and store a reset token for the user in the database
    const token = await this.authService.generatePasswordResetToken(email);

    console.log(token);
    // await this.authService.sendPasswordResetEmail(email);
    return { message: 'Password reset email sent successfully.' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    // Verify the reset token and update the user's password
    await this.authService.resetPassword(token, password);

    // Respond with a success message

    return { success: true };
  }
}
