import bcryptjs from 'bcryptjs';
import { Schema, model } from 'mongoose';

const { compare, genSalt, hash } = bcryptjs;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['jobseeker', 'employer'],
      default: 'jobseeker',
    },
    // Job Seeker Profile
    headline: { type: String, trim: true, maxlength: 200 },
    bio: { type: String, trim: true, maxlength: 1000 },
    location: { type: String, trim: true },
    phone: { type: String, trim: true },
    website: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    experience: { type: String, trim: true },
    education: { type: String, trim: true },
    resume: { type: String }, // file path
    resumeOriginalName: { type: String },

    // Employer Profile
    companyName: { type: String, trim: true },
    companyDescription: { type: String, trim: true, maxlength: 2000 },
    companyWebsite: { type: String, trim: true },
    companySize: { type: String, trim: true },
    industry: { type: String, trim: true },
    companyLogo: { type: String },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await genSalt(12);
  this.password = await hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await compare(candidatePassword, this.password);
};

export default model('User', userSchema);
