import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';
import { SclassSchema } from './schemas/sclass.schema/sclass.schema';
import { SclassesController } from './sclasses.controller';
import { SclassesService } from './sclasses.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Sclasses', // name of db table
        useFactory: () => {
          // defining nested field index
          SclassSchema.index({ 'field1.nestedField': 1 }, { unique: true });
          // defining single field index
          SclassSchema.index({ field2: 1 }, { unique: true });
          // defining multiple fields composite key index
          SclassSchema.index({ field3: 1, field4: 1 }, { unique: true });
          // defining text indexes
          SclassSchema.index({ searchField1: 'text', searchField2: 'text' });

          SclassSchema.set('toJSON', {
            virtuals: true,
            getters: true,
            transform: (doc, ret, options) => {
              ret.sclassId = ret._id;
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

          SclassSchema.set('toObject', {
            virtuals: true,
          });
          // setup virtuals
          SclassSchema.virtual('virtualFields', {
            ref: 'RefDbName', // reference db
            localField: '_id', // leave it as is
            foreignField: 'sclassId', // change sclass to module name
            justOne: false, // leave it as is
          });

          return SclassSchema;
        },
      },
    ]),

    // include the dependency modules here
    forwardRef(() => SharedModule),
  ],
  controllers: [SclassesController],
  providers: [SclassesService],
  exports: [SclassesService],
})
export class SclassesModule {}
