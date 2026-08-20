import { HydratedDocument, Model, Schema, Types, model, models } from "mongoose";

export type ChittyPaymentEntryDocument = {
  memberId: Types.ObjectId;
  cash: number;
  gpay: number;
  gpayChecked: boolean;
  missingCount: number;
  remarks: string;
};

export interface ChittyPaymentSheetDocument {
  _id: Types.ObjectId;
  date: Date;
  entries: ChittyPaymentEntryDocument[];
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ChittyPaymentSheetHydratedDocument = HydratedDocument<ChittyPaymentSheetDocument>;

const entrySchema = new Schema<ChittyPaymentEntryDocument>(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    cash: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    gpay: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    gpayChecked: {
      type: Boolean,
      default: false,
    },
    missingCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    remarks: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  {
    _id: false,
  },
);

const chittyPaymentSheetSchema = new Schema<ChittyPaymentSheetDocument>(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
      index: true,
    },
    entries: {
      type: [entrySchema],
      default: [],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    strict: true,
    minimize: false,
  },
);

const ChittyPaymentSheet: Model<ChittyPaymentSheetDocument> =
  (models.ChittyPaymentSheet as Model<ChittyPaymentSheetDocument>) ??
  model<ChittyPaymentSheetDocument>("ChittyPaymentSheet", chittyPaymentSheetSchema);

export default ChittyPaymentSheet;
