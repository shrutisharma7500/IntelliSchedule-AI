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

    // Safety: If it's already a bcrypt hash, don't hash it again
    if (this.password.startsWith("$2b$") && this.password.length === 60) {
        console.log("Password already looks like a hash, skipping double-hashing");
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
    console.log("--- AUTH DIAGNOSTIC ---");
    console.log("Comparing passwords for user:", this.email);
    try {
        const inputLen = (candidatePassword || "").length;
        const storedLen = (this.password || "").length;

        console.log("Input password length:", inputLen);
        console.log("Stored hash length:", storedLen);

        if (inputLen > 0) {
            console.log(`Input preview: ${candidatePassword[0]}***${candidatePassword[inputLen - 1]}`);
        }

        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log("Match result:", isMatch);
        console.log("------------------------");
        return isMatch;
    } catch (err) {
        console.error("Comparison error:", err);
        return false;
    }
};

export default mongoose.model("User", userSchema);
