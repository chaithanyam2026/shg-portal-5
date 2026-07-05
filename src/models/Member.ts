import {
    InferSchemaType,
    Model,
    Types,
    model,
    models,
} from 'mongoose';

import { createSchema } from '@/lib/db/schema';

/**
 * SHG Member
 *
 * Stores member profile information.
 *
 * Authentication information is stored in the User collection.
 */
const memberSchema = createSchema({
    memberCode: {
        type: String,
        required: true,
       // unique: true,
        trim: true,
        uppercase: true,
        minlength: 1,
        maxlength: 20,
    },

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 150,
    },

    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 15,
    },

    address: {
        type: String,
        default: '',
        trim: true,
        maxlength: 500,
    },

    joinDate: {
        type: Date,
        required: true,
        default: Date.now,
    },

    active: {
        type: Boolean,
        default: true,
        required: true,
    },

    remarks: {
        type: String,
        default: '',
        trim: true,
        maxlength: 1000,
    },

    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
});

/**
 * Indexes
 */
memberSchema.index(
    {
        memberCode: 1,
    },
    {
        unique: true,
    },
);

memberSchema.index(
    {
        phone: 1,
    },
    {
        unique: true,
    },
);

memberSchema.index({
    active: 1,
});

memberSchema.index({
    name: 1,
});

memberSchema.index({
    joinDate: 1,
});

/**
 * Mongoose document type
 */
export type MemberDocument = InferSchemaType<
    typeof memberSchema
> & {
    _id: Types.ObjectId;
};

/**
 * Member model
 *
 * Uses the existing model if already compiled to support
 * Next.js Fast Refresh.
 */
const Member: Model<MemberDocument> =
    (models.Member as Model<MemberDocument>) ??
    model<MemberDocument>('Member', memberSchema);

export default Member;

export { Member };