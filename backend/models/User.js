import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    calApiKey: {
        type: String,
        default: ""
    },
    calEventTypeId: {
        type: String,
        default: ""
    },
    calUsername: {
        type: String,
        default: ""
    },
    smtpUser: {
        type: String,
        default: ""
    },
    smtpPass: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        console.log("Password not modified, skipping hash");
        return;
    }

    try {
        console.log("Hashing password for user:", this.email);
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log("Password hashed successfully");
    } catch (err) {
        console.error("Hashing error:", err);
        throw err;
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    console.log("Comparing passwords for user:", this.email);
    try {
        console.log("Candidate password provided:", !!candidatePassword);
        console.log("Stored hash available:", !!this.password);
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log("Match result:", isMatch);
        return isMatch;
    } catch (err) {
        console.error("Comparison error:", err);
        return false;
    }
};

export default mongoose.model("User", userSchema);
