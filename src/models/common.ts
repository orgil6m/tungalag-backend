import { Document, ResolveSchemaOptions, Schema } from "mongoose";

export type CommonDocument = Document & {
  createdBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedBy?: Schema.Types.ObjectId;
  updatedAt?: Date;
};

export const CommonSchema = <T>(
  definition: Record<string, any>,
  options?: ResolveSchemaOptions<T>
) => {
  return new Schema<T>(
    {
      ...definition,
      createdBy: { type: Schema.Types.ObjectId, ref: "User" },
      updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    {
      timestamps: true,
      versionKey: false,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
      ...options,
    }
  );
};
