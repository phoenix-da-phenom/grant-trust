const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true }, // Removed unique: false (not needed)
    phone: { type: String, required: true },
    category: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    trackno: { type: String, required: true, unique: true }, // Only unique field
    dateofbirth: { type: Date, required: true },
    governmentID: { type: String, required: true },
    proofofaddress: { type: String, required: true },
    inventorylist: { type: String, required: true },
    weightandpurity: { type: String, required: true },
    photographorvideo: { type: String, required: true },
    estimatedvalue: { type: Number, required: true },
    serialnumber: { type: String, required: true },
    durationofstorage: {
        type: String,
        enum: ["short-term", "long-term"],
        default: "short-term"
    },
    insuarancecoverage: { type: String, required: false },
    mediaType: {
        type: String,
        enum: ['photo', 'video'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);