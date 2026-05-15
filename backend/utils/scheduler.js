const cron = require("node-cron");
const { runEscalationCheck } = require("./escalationService");

const startScheduler = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("Scheduled escalation check running...");
    const count = await runEscalationCheck();
    console.log(`Escalation check complete. ${count} complaints escalated.`);
  });

  console.log("Scheduler started — escalation check runs every hour");
};

module.exports = { startScheduler };
