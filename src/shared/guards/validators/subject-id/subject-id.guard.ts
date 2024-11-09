import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { SubjectsService } from 'src/app-modules/subjects/subjects.service';
import { ErrorConstant } from 'src/constants/error';
import { TicketModel } from 'src/shared/models/ticket-model/ticket-model';

@Injectable()
export class SubjectIdGuard implements CanActivate {
  constructor(private readonly subjectsService: SubjectsService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    let req = ctx.getRequest<Request>();

    if (!req['ticket']) {
      throw new UnauthorizedException({
        error: ErrorConstant.MISSING_FIELD,
        msgVars: { field: 'ticket' },
      });
    }

    if (!req.body.subjectId) {
      throw new UnauthorizedException({
        error: ErrorConstant.MISSING_FIELD,
        msgVars: { field: 'subjectId' },
      });
    }

    let query = {
      subjectId: req.body.subjectId,
      deleted: 'all',
    };

    const { user, permission } = req['ticket'] as TicketModel;

    switch (permission.restriction) {
      // case 'organizationId': {
      //   query['$or'] = [
      //     { offsetPrinterId: String(user.organizationId) },
      //     { clientId: String(user.organizationId) },
      //   ];
      //   break;
      // }

      case 'userId': {
        query['creatorId'] = String(user._id);
        break;
      }

      default: {
        break;
      }
    }

    let foundSubject = await this.subjectsService.get(query);

    if (!foundSubject || !foundSubject.totalCount) {
      throw new UnauthorizedException({
        error: ErrorConstant.INVALID_FIELD,
        msgVars: {
          field: 'subjectId',
        },
      });
    }

    if (!req['storage']) {
      req['storage'] = {};
    }

    req['storage']['subject'] = foundSubject.subjects[0];

    return true;
  }
}
