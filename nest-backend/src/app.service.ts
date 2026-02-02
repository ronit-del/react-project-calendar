import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  login(): any {
    return {
      message: 'Login successful!',
      status: 200,
      data: {
        email: 'test@test.com',
        password: 'test',
      },
    };
  }
}
