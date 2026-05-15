const Complaint = require("../models/Complaint");
const expressAsyncHandler = require("express-async-handler");
const { runEscalationCheck } = require("../utils/escalationService");
const getSLADeadline = (priority) => {
  const hours = {
    Critical: 24,
    High: 48,
    Medium: 72,
    Low: 120,
  };
  const ms = (hours[priority] || 72) * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
};

// @route   POST /api/complaints
// @desc    Submit a new complaint
// @access  Private (logged-in citizens, staff, admin)

const submitComplaint = expressAsyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    area,
    location,
    priority,
    coordinates,
  } = req.body;

  if (!title || !description || !category || !area || !location) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const images = req.files
    ? req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }))
    : [];

  const complaint = await Complaint.create({
    title,
    description,
    category,
    area,
    location,
    priority: priority || "Medium",
    coordinates: coordinates || {},
    images,
    submittedBy: req.user._id,
    slaDeadline: getSLADeadline(priority || "Medium"),
    statusHistory: [
      {
        status: "Open",
        changedBy: req.user._id,
        note: "Complaint submitted",
      },
    ],
  });

  res.status(201).json(complaint);
});

// @route   GET /api/complaints
// @desc    Get complaints (filtered by role)
// @access  Private

const getComplaints = expressAsyncHandler(async (req, res) => {
  const {
    status,
    category,
    area,
    priority,
    search,
    page = 1,
    limit = 10,
  } = req.query;

  let filter = {};
  if (req.user.role === "citizen") {
    filter.submittedBy = req.user._id;
  }

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (area) filter.area = area;
  if (priority) filter.priority = priority;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const total = await Complaint.countDocuments(filter);

  const complaints = await Complaint.find(filter)
    .populate("submittedBy", "name email area")
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.json({
    complaints,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    total,
  });
});

// @route   GET /api/complaints/:id
// @desc    Get a single complaint by ID
// @access  Private

const getComplaintById = expressAsyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate("submittedBy", "name email area")
    .populate("assignedTo", "name email")
    .populate("statusHistory.changedBy", "name role");

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  if (
    req.user.role === "citizen" &&
    complaint.submittedBy._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to view this complaint");
  }

  res.json(complaint);
});

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status (staff/admin only)
// @access  Private — staff, admin

const updateComplaintStatus = expressAsyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const validStatuses = [
    "Open",
    "In Progress",
    "Resolved",
    "Escalated",
    "Closed",
  ];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  complaint.status = status;

  if (status === "Resolved") {
    complaint.resolvedAt = new Date();
    complaint.resolutionNote = note || "";
  }

  complaint.statusHistory.push({
    status,
    changedBy: req.user._id,
    note: note || "",
    changedAt: new Date(),
  });

  const updated = await complaint.save();
  res.json(updated);
});

// @route   PUT /api/complaints/:id/assign
// @desc    Assign complaint to a staff member
// @access  Private — admin only

const assignComplaint = expressAsyncHandler(async (req, res) => {
  const { staffId } = req.body;

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  complaint.assignedTo = staffId;

  if (complaint.status === "Open") {
    complaint.status = "In Progress";
    complaint.statusHistory.push({
      status: "In Progress",
      changedBy: req.user._id,
      note: "Assigned to staff member",
      changedAt: new Date(),
    });
  }

  const updated = await complaint.save();
  res.json(updated);
});

// @route   GET /api/complaints/stats
// @desc    Get complaint statistics for dashboard
// @access  Private — staff, admin

const getComplaintStats = expressAsyncHandler(async (req, res) => {
  const statusStats = await Complaint.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const categoryStats = await Complaint.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const overdueCount = await Complaint.countDocuments({
    slaDeadline: { $lt: new Date() },
    status: { $nin: ["Resolved", "Closed"] },
  });

  const totalComplaints = await Complaint.countDocuments();

  const resolvedComplaints = await Complaint.countDocuments({
    status: "Resolved",
  });

  res.json({
    total: totalComplaints,
    resolved: resolvedComplaints,
    overdue: overdueCount,
    byStatus: statusStats,
    byCategory: categoryStats,
  });
});

// @route   DELETE /api/complaints/:id
// @desc    Delete a complaint (admin only)
// @access  Private — admin

const deleteComplaint = expressAsyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  await complaint.deleteOne();
  res.json({ message: "Complaint removed successfully" });
});

// @route   POST /api/complaints/escalate/run
// @desc    Manually trigger escalation check (admin only)
// @access  Private — admin

const triggerEscalation = expressAsyncHandler(async (req, res) => {
  const count = await runEscalationCheck();
  res.json({
    message: `Escalation check complete. ${count} complaints escalated.`,
    escalated: count,
  });
});

module.exports = {
  submitComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  getComplaintStats,
  deleteComplaint,
  triggerEscalation,
};
