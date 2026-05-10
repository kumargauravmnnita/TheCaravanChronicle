const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a complaint title"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Please describe the issue"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Road Damage",
        "Water Leakage",
        "Garbage",
        "Electrical Issue",
        "Structural Damage",
        "Sanitation",
        "Noise Complaint",
        "Other",
      ],
    },

    area: {
      type: String,
      required: [true, "Please specify the area"],
    },

    location: {
      type: String,
      required: [true, "Please specify the location"],
    },

    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Escalated", "Closed"],
      default: "Open",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    images: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],

    slaDeadline: {
      type: Date,
    },

    isEscalated: {
      type: Boolean,
      default: false,
    },

    statusHistory: [
      {
        status: { type: String },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        note: { type: String },
        changedAt: { type: Date, default: Date.now },
      },
    ],

    resolutionNote: {
      type: String,
      default: "",
    },

    resolvedAt: {
      type: Date,
    },
  },

  {
    timestamps: true,
  },
);

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
