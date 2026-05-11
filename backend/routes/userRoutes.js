const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getStaffMembers,
  updateUserRole,
  deactivateUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin"), getAllUsers);
router.get("/staff", protect, authorize("admin", "staff"), getStaffMembers);
router.put("/:id/role", protect, authorize("admin"), updateUserRole);
router.put("/:id/deactivate", protect, authorize("admin"), deactivateUser);

module.exports = router;
