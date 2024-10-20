import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: false,
    },
    apiUsed: {
        type: Map,
        of: new mongoose.Schema({
            time: {
                type: Date,
                required: true,
            },
            api: {
                type: String,
                required: true,
            },
            ipAddress: {
                type: String,
            },
        }),
        required: false,
        default: {},
    },
}, {
    timestamps: true,
});

export default mongoose.model("User", UserSchema);
