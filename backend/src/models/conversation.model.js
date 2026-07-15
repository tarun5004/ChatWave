import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "users"}], //type: array of ObjectIds referencing the User model
        validate: {
            validator: (arr) => arr.length === 2,
            message: "A conversation must have exactly 2 participants.",
        },
        required: true,   
    },
    lastMessageAt: { type: Date, default: Date.now },
}, { timestamps: true });

conversationSchema.index({ participants: 1}); // Create an index on the participants field for faster queries




export default mongoose.model("Conversation", conversationSchema);
