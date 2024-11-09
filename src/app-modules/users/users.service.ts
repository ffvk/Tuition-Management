import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user/user';
import { Model } from 'mongoose';
import { HelperService } from 'src/shared/helpers/helper/helper.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users')
    private readonly userModel: Model<User>,
    private readonly helperService: HelperService,
  ) {}

  async get(query?: { [key: string]: any }) {
    let readQuery: { [key: string]: any } = {};

    if (query.userId) {
      readQuery._id = query.userId;
    }

    if (query.userIds) {
      readQuery._id = { $in: query.userIds.split(',') };
    }

    if (query.name) {
      readQuery.name = { $regex: new RegExp(query.name, 'i') };
    }

    if (query.bio) {
      readQuery.bio = { $regex: new RegExp(query.bio, 'i') };
    }

    if (query.emailValue) {
      readQuery['email.value'] = query.emailValue;
    }

    if (query.emailOTP) {
      readQuery['email.otp'] = query.emailOTP;
    }

    if (
      String(query.emailVerified) === 'true' ||
      String(query.emailVerified) === 'false'
    ) {
      readQuery['email.verified'] = String(query.emailVerified) === 'true';
    }

    if (query.gender) {
      readQuery.gender = {
        $regex: new RegExp(query.gender, 'i'),
      };
    }

    if (query.role) {
      readQuery.role = query.role;
    }

    if (query.search) {
      readQuery['$text'] = { $search: query.search };
    }

    readQuery.sort = { 'timestamp.createdAt': -1 };
    if (query.sort) {
      switch (query.sort) {
        case 'mrc': {
          readQuery.sort = { 'timestamp.createdAt': -1 };
          break;
        }

        case 'mru': {
          readQuery.sort = { 'timestamp.updatedAt': -1 };
          break;
        }

        case 'namea': {
          readQuery.sort = { name: 1 };
          break;
        }

        case 'named': {
          readQuery.sort = { name: -1 };
          break;
        }
      }
    }

    query.sort = readQuery.sort;
    delete readQuery.sort;

    let limit: number = !isNaN(query.limit)
      ? query.limit === -1
        ? 0
        : query.limit
      : 20;

    let page: number = !isNaN(query.page) ? query.page : 1;
    let skip = (page - 1) * limit;

    query.fields = query.fields
      ? query.fields
          .split(',')
          .reduce((a: any, b: any) => ((a[b] = true), a), {})
      : {};

    let users = await this.userModel
      .find(readQuery)
      .populate('tokens')
      .select(query.fields)
      .limit(limit)
      .sort(query.sort)
      .skip(skip)
      .populate(query.populate || '') // this is experimental field
      .exec();

    let totalCount = await this.userModel.countDocuments(readQuery);

    return {
      totalCount,
      currentCount: users.length,
      users: (users.length && users) || null,
    };
  }
}
