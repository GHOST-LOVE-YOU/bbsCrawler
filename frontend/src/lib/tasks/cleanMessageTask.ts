import { deleteOldMessages } from "@lib/messages/server-utils";
import "server-only";

async function handleCleanMessageTask() {
  try {
    await deleteOldMessages();

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export default handleCleanMessageTask;
