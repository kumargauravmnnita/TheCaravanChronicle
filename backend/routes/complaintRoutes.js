const express = require("express");
const router = express.Router();
const { triggerEscalation } = require("../controllers/complaintController");
const {
  submitComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  getComplaintStats,
  deleteComplaint,
} = require("../controllers/complaintController");

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/stats", protect, authorize("staff", "admin"), getComplaintStats);

router.post("/", protect, upload.array("images", 5), submitComplaint);

router.get("/", protect, getComplaints);
router.post("/escalate/run", protect, authorize("admin"), triggerEscalation);

router.get("/public/stats", async (req, res) => {
  try {
    const Complaint = require("../models/Complaint");

    const total = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: "Resolved" });
    const open = await Complaint.countDocuments({ status: "Open" });
    const inProgress = await Complaint.countDocuments({
      status: "In Progress",
    });
    const escalated = await Complaint.countDocuments({
      isEscalated: true,
    });
    const overdue = await Complaint.countDocuments({
      slaDeadline: { $lt: new Date() },
      status: { $nin: ["Resolved", "Closed"] },
    });

    const byCategory = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentResolved = await Complaint.find({ status: "Resolved" })
      .select("title category area resolvedAt")
      .sort({ resolvedAt: -1 })
      .limit(5);

    res.json({
      total,
      resolved,
      open,
      inProgress,
      escalated,
      overdue,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      byCategory,
      recentResolved,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch public stats" });
  }
});

router.get("/:id", protect, getComplaintById);

router.put(
  "/:id/status",
  protect,
  authorize("staff", "admin"),
  updateComplaintStatus,
);

router.put("/:id/assign", protect, authorize("admin"), assignComplaint);

router.delete("/:id", protect, authorize("admin"), deleteComplaint);

module.exports = router;
