import { cleanOldNotificationRules } from "@lib/notificationRule/server-utils";
import "server-only";

async function handleCleanNotifyRuleTask() {
  try {
    await cleanOldNotificationRules();

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export default handleCleanNotifyRuleTask;
