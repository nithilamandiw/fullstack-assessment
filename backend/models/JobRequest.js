const mongoose = require("mongoose");

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      trim: true,
      enum: {
        values: ["Plumbing", "Electrical", "Painting", "Joinery", "General"],
        message: "{VALUE} is not a valid category",
      },
      default: "General",
    },
    location: {
      type: String,
      trim: true,
    },
    contactName: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // allow empty
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please provide a valid email address",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["Open", "In Progress", "Closed"],
        message: "{VALUE} is not a valid status",
      },
      default: "Open",
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

module.exports = mongoose.model("JobRequest", jobRequestSchema, "jobRequests");
