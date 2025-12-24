import mongoose from "mongoose";

const pgHostelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        rent: {
            type: Number,
            required: true,
        },

        gender: {
            type: String,
            enum: ["male", "female", "unisex"],
            required: true,
        },

        contactNumber: {
            type: String,
            required: true,
        },

        amenities: {
            type: [String],
            default: [],
        },

        images: {
            type: [String],
            default: [],
        },

        location: {
            address: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            pincode: {
                type: String,
                required: true,
            },
        },
    },
    { timestamps: true }
);

export default mongoose.model("PGHostel", pgHostelSchema);
