import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

mongoose.connect('mongodb://localhost:27017/bookhub');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

const createAdmin = async () => {
    try {
        const email = "admin@bookhub.com";
        const passwordPlain = "admin123";
        
        await User.deleteOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordPlain, salt);

        const newAdmin = new User({
            username: "Super Admin",
            email: email,
            password: hashedPassword,
            isAdmin: true
        });

        await newAdmin.save();
        console.log("✅ Admin user created successfully!");
        console.log(`Email: ${email}`);
        console.log(`Password: ${passwordPlain}`);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
};

createAdmin();
