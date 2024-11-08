import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfiguration from './config/app.configuration';
import dbConfiguration from './config/db.configuration';
import { GenericExceptionFilter } from './shared/filters/generic-exception/generic-exception.filter';
import { HttpExceptionFilter } from './shared/filters/http-exception/http-exception.filter';
import { PermissionGuard } from './shared/guards/permission/permission.guard';
import { TokenGuard } from './shared/guards/token/token.guard';
import { HelperService } from './shared/helpers/helper/helper.service';
import { SharedModule } from './shared/shared.module';
import { HomeworksModule } from './app-modules/homeworks/homeworks.module';
import { SubjectsModule } from './app-modules/subjects/subjects.module';
import { ClassesModule } from './app-modules/classes/classes.module';
import { PermissionsModule } from './app-modules/permissions/permissions.module';
import { TokensModule } from './app-modules/tokens/tokens.module';
import { UsersModule } from './app-modules/users/users.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration, dbConfiguration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          'mongodb://' +
          configService.get<string>('db.host') +
          ':' +
          configService.get<string>('db.port') +
          '/' +
          configService.get<string>('db.name'),
      }),
      inject: [ConfigService],
    }),
    SharedModule,
    UsersModule,
    TokensModule,
    PermissionsModule,
    ClassesModule,
    SubjectsModule,
    HomeworksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GenericExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: TokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
