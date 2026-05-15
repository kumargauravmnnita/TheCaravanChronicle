const Complaint = require("../models/Complaint");

const runEscalationCheck = async () => {
  try {
    console.log("Running escalation check...");

    const overdueComplaints = await Complaint.find({
      slaDeadline: { $lt: new Date() },
      status: { $nin: ["Resolved", "Closed", "Escalated"] },
      isEscalated: false,
    });

    console.log(`Found ${overdueComplaints.length} overdue complaints`);

    for (const complaint of overdueComplaints) {
      complaint.status = "Escalated";
      complaint.isEscalated = true;

      complaint.statusHistory.push({
        status: "Escalated",
        note: "Auto-escalated: SLA deadline breached",
        changedAt: new Date(),
      });

      await complaint.save();
      console.log(`Escalated complaint: ${complaint._id} — ${complaint.title}`);
    }

    return overdueComplaints.length;
  } catch (error) {
    console.error("Escalation check failed:", error.message);
  }
};

module.exports = { runEscalationCheck };
