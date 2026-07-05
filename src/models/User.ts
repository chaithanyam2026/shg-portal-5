import {
    InferSchemaType,
    Model,
    Schema,
    Types,
    model,
    models,
} from 'mongoose';

import { createSchema } from '@/lib/db/schema';
import {
    USER_ROLES,
    USER_ROLE_VALUES,
} from '@/lib/constants/roles';
import {
    USER_STATUS,
    USER_STATUS_VALUES,
} from '@/lib/constants/user-status';

/**
 * Authentication User
 *
 * This model stores only authentication and authorization
 * information.
 *
 * Member-specific information belongs to the Member collection.
 */
const userSchema = createSchema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 50,
    },

    passwordHash: {
        type: String,
        required: true,
        minlength: 60,
        maxlength: 255,
    },

    role: {
        type: String,
        enum: USER_ROLE_VALUES,
        default: USER_ROLES.MEMBER,
        required: true,
    },

    status: {
        type: String,
        enum: USER_STATUS_VALUES,
        default: USER_STATUS.ACTIVE,
        required: true,
    },

    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'Member',
        default: null,
    },

    lastLoginAt: {
        type: Date,
        default: null,
    },
});

/**
 * Indexes
 */
userSchema.index(
    {
        username: 1,
    },
    {
        unique: true,
    },
);

userSchema.index({
    memberId: 1,
});

userSchema.index({
    role: 1,
});

userSchema.index({
    status: 1,
});

/**
 * Mongoose document type
 */
export type UserDocument = InferSchemaType<typeof userSchema> & {
    _id: Types.ObjectId;
};

/**
 * User model
 *
 * Uses the existing model if already compiled to support
 * Next.js Fast Refresh.
 */
const User: Model<UserDocument> =
    (models.User as Model<UserDocument>) ??
    model<UserDocument>('User', userSchema);

export default User;

export { User };