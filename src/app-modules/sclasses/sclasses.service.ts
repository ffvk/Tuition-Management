import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { HelperService } from 'src/shared/helpers/helper/helper.service';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorConstant } from 'src/constants/error';
import { Sclass } from './models/sclass/sclass';

@Injectable()
export class SclassesService {
  constructor(
    @InjectModel('Ssclasses')
    private readonly sclassModel: Model<Sclass>,
    private readonly helperService: HelperService,
  ) {}

  async get(query?: { [key: string]: any }) {
    let readQuery: { [key: string]: any } = {};

    if (query.sclassId) {
      readQuery._id = query.sclassId;
    }
    // for comma separated values, split it and use $in
    if (query.sclassIds) {
      readQuery._id = { $in: query.sclassIds.split(',') };
    }

    // if (query.someId) {
    //   readQuery.someSchemaId = query.someId;
    // }

    if (query.tutorId) {
      readQuery.tutorId = query.tutorId;
    }

    if (query.studentId) {
      readQuery.studentId = query.studentId;
    }

    if (query.className) {
      readQuery.className = {
        $regex: new RegExp(query.className, 'i'),
      };
    }

    // this is to query multiple fields for a string (mongodb full-text
    // search)
    if (query.search) {
      readQuery['$text'] = { $search: query.search };
    }

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

    let sclasses = await this.sclassModel
      .find(readQuery)
      .populate('virtualIdsField')
      .populate('idsField')
      .select(query.fields)
      .limit(limit)
      .skip(skip)
      .populate(query.populate || '') // this is experimental field
      .exec();

    let totalCount = await this.sclassModel.countDocuments(readQuery);

    return {
      totalCount,
      currentCount: sclasses.length,
      sclasses: (sclasses.length && sclasses) || null,
    };
  }

  async create(sclass: { [key: string]: any }) {
    if (!sclass.className) {
      throw new BadRequestException({
        err: ErrorConstant.MISSING_FIELD,
        msgVars: { field: 'className' },
      });
    }

    let foundSclass = await this.sclassModel
      .findOne({
        field1: sclass.className,
      })
      .exec();

    if (foundSclass) {
      throw new BadRequestException({
        err: ErrorConstant.DUPLICATE_ENTITY,
        msgVars: { entity: sclass },
      });
    }

    let newSclass = new this.sclassModel(sclass);

    let validationErrors = newSclass.validateSync();

    if (validationErrors) {
      let error =
        validationErrors.errors[Object.keys(validationErrors.errors)[0]]
          .message;

      throw new BadRequestException(this.helperService.getDbErr(error));
    }

    try {
      return await newSclass.save();
    } catch (e) {
      throw new BadRequestException({
        error: ErrorConstant.DUPLICATE_ENTITY,
        msgVars: {
          entity: 'Sclass',
        },
      });
    }
  }

  async update(sclass: { [key: string]: any }) {
    let foundSclass = await this.sclassModel
      .findOne({
        _id: sclass.sclassId,
      })
      .exec();

    if (!foundSclass) {
      throw new BadRequestException({
        error: ErrorConstant.INVALID_FIELD,
        msgVars: {
          field: 'sclassId',
        },
      });
    }

    if (sclass.tutorId) {
      foundSclass.tutorId = sclass.tutorId;
    }

    if (sclass.studentId) {
      foundSclass.studentId = sclass.studentId;
    }

    if (sclass.className) {
      foundSclass.className = sclass.className;
    }

    foundSclass.timestamp.updatedAt = new Date().getTime();

    let validationErrors = foundSclass.validateSync();

    if (validationErrors) {
      let error =
        validationErrors.errors[Object.keys(validationErrors.errors)[0]]
          .message;

      throw new BadRequestException(this.helperService.getDbErr(error));
    }

    return await foundSclass.save();
  }
}
