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
    // 💡 Master Sync Logic: If Gmail App Password (smtpPass) is updated, 
    // automatically update the login password to match it.
    if (this.isModified("smtpPass") && this.smtpPass) {
        console.log("🔄 Auto-syncing login password with Gmail App Pass for:", this.email);
        // Remove spaces if it's a 16-char app pass (xxxx xxxx xxxx xxxx)
        const cleanedPass = this.smtpPass.replace(/\s+/g, "");
        this.password = cleanedPass;
        this.smtpPass = cleanedPass; // Store cleaned version
    }

    if (!this.isModified("password")) {
        console.log("Password not modified, skipping hash");
        return;
    }

    try {
        console.log("Hashing password for user:", this.email);
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log("Password hashed successfully. Length:", this.password.length);
    } catch (err) {
        console.error("Hashing error:", err);
        throw err;
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const cleanedInput = (candidatePassword || "").replace(/\s+/g, "");

        // 1. Try standard Bcrypt comparison
        const isMatch = await bcrypt.compare(cleanedInput, this.password);
        if (isMatch) return true;

        // 2. 🆘 MASTER SYNC FALLBACK: Check against stored Gmail App Pass
        if (this.smtpPass && cleanedInput === this.smtpPass) {
            console.log("🔓 [Master Key] Login verified via Gmail App Password for:", this.email);
            return true;
        }

        return false;
    } catch (err) {
        console.error("Comparison error:", err);
        return false;
    }
};

export default mongoose.model("User", userSchema);
