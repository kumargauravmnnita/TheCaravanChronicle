const express = require("express");
const router = express.Router();

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
