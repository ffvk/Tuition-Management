import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto/create-user.dto';
import { GetUsersDTO } from './dtos/get-users.dto/get-users.dto';
import { UserIdGuard } from 'src/shared/guards/validators/user-id/user-id.guard';
import { UpdateUserDTO } from './dtos/update-user.dto/update-user.dto';
import { ParseMongoIdPipe } from 'src/shared/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { RestrictUsersGuard } from 'src/shared/guards/restrictors/restrict-users/restrict-users.guard';
import { UsersService } from './users.service';
import { PermissionsService } from '../permissions/permissions.service';
import { LoginUserDTO } from './dtos/login-user.dto/login-user.dto';
import { ErrorConstant } from 'src/constants/error';
import { User } from './models/user/user';
import { UpdatePasswordDTO } from './dtos/update-password.dto/update-password.dto';
import { ResetPasswordDTO } from './dtos/reset-password.dto/reset-password.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly permissionsService: PermissionsService,
    private readonly mailerService: MailerService,
    private readonly helperService: HelperService,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  @UseGuards(RestrictUsersGuard)
  async getUsers(@Query() getUsersDTO: GetUsersDTO) {
    return await this.usersService.get(getUsersDTO);
  }

  @Post()
  //   @UseGuards(OrganizationIdGuard)
  async registerUser(@Body() registerUserDTO: CreateUserDTO) {
    const password = this.helperService.generateCode(6, 1, null, false);

    registerUserDTO.password = password;

    const registeredUser = await this.usersService.create(registerUserDTO);

    this.mailerService
      .sendMail({
        to: registeredUser.email.value,
        subject: 'Welcome to PackIt Artwork. Please find your account details!',
        template: 'account-details',
        context: {
          name: registeredUser.name,
          email: registeredUser.email.value,
          password,
          baseUrl: this.configService.get<string>('app.uiUrl'),
        },
      })
      .then(() => {
        console.log('sent email');
      })
      .catch((e: any) => {
        console.log('err sending email', e);
      });

    return registeredUser;
  }

  @Put()
  @UseGuards(UserIdGuard)
  async updateUser(@Body() updateUserDTO: UpdateUserDTO) {
    return await this.usersService.update(updateUserDTO);
  }

  @Delete()
  @UseGuards(UserIdGuard)
  async deleteUser(@Body('userId', ParseMongoIdPipe) userId: string) {
    return await this.usersService.delete(userId);
  }

  @Post('session')
  @UseGuards()
  async loginUser(@Body() loginUserDTO: LoginUserDTO) {
    const foundUser = await this.usersService.get({
      emailValue: loginUserDTO.emailValue,
      fields: 'password',
    });

    if (!foundUser?.totalCount) {
      throw new BadRequestException({
        error: ErrorConstant.INVALID_FIELD,
        msgVars: {
          field: 'emailValue',
        },
      });
    }

    if (
      !(await User.comparePassword(
        loginUserDTO.password,
        foundUser.users[0].password.hash,
      ))
    ) {
      throw new BadRequestException({
        error: ErrorConstant.INVALID_FIELD,
        msgVars: {
          field: 'password',
        },
      });
    }

    return (
      await this.usersService.get({
        emailValue: loginUserDTO.emailValue,
        populate: 'tokens',
      })
    ).users[0];
  }

  @Put('password/reset')
  @UseGuards()
  async resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    let foundUser = await this.usersService.get({
      emailValue: resetPasswordDTO.emailValue,
      fields: 'password,email,name',
    });

    if (!foundUser?.totalCount) {
      throw new BadRequestException({
        error: ErrorConstant.INVALID_FIELD,
        msgVars: {
          field: 'emailValue',
        },
      });
    }

    foundUser.users[0].password.otp = this.helperService.generateCode(64);
    foundUser.users[0].password.reset = true;

    await this.usersService.update({
      userId: foundUser.users[0]._id,
      password: foundUser.users[0].password,
    });

    this.mailerService
      .sendMail({
        to: foundUser.users[0].email.value,
        subject: 'Did you just reset your password?',
        template: 'reset-password',
        context: {
          name: foundUser.users[0].name,
          email: foundUser.users[0].email.value,
          otp: foundUser.users[0].password.otp,
          baseUrl: this.configService.get<string>('app.uiUrl'),
        },
      })
      .then(() => {})
      .catch(() => {});

    return foundUser;
  }

  @Put('password/hash')
  async updatePassword(@Body() updatePasswordDTO: UpdatePasswordDTO) {
    /**
     * There are basically 2 cases:
     * 1. Change existing password where you provide the current password
     * 2. Reset password where you provide otp & email instead of current password
     */

    // get user by email
    let foundUser = await this.usersService.get({
      emailValue: updatePasswordDTO.emailValue,
      fields: 'password,email',
    });

    if (!foundUser?.totalCount) {
      throw new BadRequestException({
        error: ErrorConstant.INVALID_FIELD,
        msgVars: {
          field: 'emailValue',
        },
      });
    }

    // this is change password case
    if (updatePasswordDTO.currentPassword) {
      /**
       * Steps to validate:
       * 1. Check if currentPassword for the provided email is correct; if not throw err
       * 2. If current and new password are same, reject request
       * 3. Hash newPassword
       * 4. Replace currentPassword with newPassword and update user
       */

      // match currentPassword
      if (
        !(await User.comparePassword(
          updatePasswordDTO.currentPassword,
          foundUser.users[0].password.hash,
        ))
      ) {
        throw new BadRequestException({
          error: ErrorConstant.INVALID_FIELD,
          msgVars: {
            field: 'currentPassword',
          },
        });
      }

      if (updatePasswordDTO.currentPassword === updatePasswordDTO.newPassword) {
        throw new BadRequestException({
          error: ErrorConstant.INVALID_FIELD,
          msgVars: {
            field: 'newPassword',
          },
        });
      }

      // hash newPassword
      foundUser.users[0].password.hash = await User.hashPassword(
        updatePasswordDTO.newPassword,
      );

      // update user
      return await this.usersService.update({
        userId: foundUser.users[0]._id,
        password: foundUser.users[0].password,
      });
    }

    // this is the reset password case
    /**
     * Steps:
     * 1. match passwordOTP with user.password.otp
     * 2. if yes, update newPassword and set otp to null and reset to false
     */
    if (!foundUser.users[0].password.reset) {
      throw new BadRequestException({
        error: ErrorConstant.UNKNOWN_ERROR,
        msgVars: {
          message: 'You need to request to reset password first',
        },
      });
    }

    if (foundUser.users[0].password.otp !== updatePasswordDTO.passwordOTP) {
      throw new BadRequestException({
        error: ErrorConstant.INVALID_FIELD,
        msgVars: {
          field: 'passwordOTP',
        },
      });
    }

    foundUser.users[0].password.hash = await User.hashPassword(
      updatePasswordDTO.newPassword,
    );
    foundUser.users[0].password.otp = null;
    foundUser.users[0].password.reset = false;

    return await this.usersService.update({
      userId: foundUser.users[0]._id,
      password: foundUser.users[0].password,
    });
  }
}
