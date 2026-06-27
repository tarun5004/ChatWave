import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true,
        unique: true
    },
    refreshToken: {
        type: String,
        required: true,
        // index: true
    }
},{
    timestamps: true
});

sessionSchema.pre("save", async function () {
    if (this.isModified("refreshToken")) {
        const salt  = await bcrypt.genSalt(10);
        this.refreshToken = await bcrypt.hash(this.refreshToken, salt);
    }
});

sessionSchema.methods.compareRefreshToken = async function (refreshToken) {
    return await bcrypt.compare(refreshToken, this.refreshToken);
}


const sessionModel = mongoose.model("sessions", sessionSchema);
export default sessionModel;