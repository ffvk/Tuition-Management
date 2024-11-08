import { Injectable } from '@nestjs/common';
import { Sclass } from './models/class/sclass';
import { Model } from 'mongoose';
import { HelperService } from 'src/shared/helpers/helper/helper.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SclassesService {
  constructor(
    @InjectModel('Sclasses')
    private readonly classModel: Model<Sclass>,
    private readonly helperService: HelperService,
  ) {}

  async get(query?: { [key: string]: any }) {
    let readQuery: { [key: string]: any } = {};

    if (query.classId) {
      readQuery._id = query.classId;
    }
    // for comma separated values, split it and use $in
    if (query.classIds) {
      readQuery._id = { $in: query.classIds.split(',') };
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

    let classes = await this.classModel
      .find(readQuery)
      .populate('virtualIdsField')
      .populate('idsField')
      .select(query.fields)
      .limit(limit)
      .skip(skip)
      .populate(query.populate || '') // this is experimental field
      .exec();

    let totalCount = await this.classModel.countDocuments(readQuery);

    return {
      totalCount,
      currentCount: classes.length,
      classes: (classes.length && classes) || null,
    };
  }



  async create(sclass: { [key: string]: any }) {
    if (
      !sclass.idField1 ||
      !sclass.idField2
    ) {
      throw new BadRequestException({
        err: ErrorConstant.MISSING_FIELD,
        msgVars: { field: idField1 or idField2 },
      });
    }
 
    let foundSclass = await this.sclassModel
      .findOne({
        field1: sclass.idField1,
        field2: sclass.idField2,
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
 
}
