import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';
import { HomeworksService } from './homeworks.service';
import { HomeworksController } from './homeworks.controller';
import { HomeworkSchema } from './schemas/homework.schema/homework.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Homeworks', // name of db table
        useFactory: () => {
          // defining nested field index
          HomeworkSchema.index({ 'field1.nestedField': 1 }, { unique: true });
          // defining single field index
          HomeworkSchema.index({ field2: 1 }, { unique: true });
          // defining multiple fields composite key index
          HomeworkSchema.index({ field3: 1, field4: 1 }, { unique: true });
          // defining text indexes
          HomeworkSchema.index({ searchField1: 'text', searchField2: 'text' });

          HomeworkSchema.set('toJSON', {
            virtuals: true,
            getters: true,
            transform: (doc, ret, options) => {
              ret.homeworkId = ret._id;
              delete ret._id;
              delete ret.id;
              delete ret.__v;
              delete ret.someField;
              // change the data from database if needed before
              // returning to user

              if (ret.emails) {
                for (let i = 0; i < ret.emails.length; i++) {
                  if (ret.emails[i].otp) {
                    delete ret.emails[i].otp;
                  }
                }
              }
            },
          });

          HomeworkSchema.set('toObject', {
            virtuals: true,
          });
          // setup virtuals
          HomeworkSchema.virtual('virtualFields', {
            ref: 'RefDbName', // reference db
            localField: '_id', // leave it as is
            foreignField: 'homeworkId', // change homework to module name
            justOne: false, // leave it as is
          });

          return HomeworkSchema;
        },
      },
    ]),

    // include the dependency modules here
    forwardRef(() => SharedModule),
  ],
  controllers: [HomeworksController],
  providers: [HomeworksService],
  exports: [HomeworksService],
})
export class HomeworksModule {}
