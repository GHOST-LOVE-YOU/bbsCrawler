import { cleanAllBindings } from "@lib/bindings/server-utils";
import "server-only";

async function handleCleanBindingTask() {
  try {
    await cleanAllBindings();

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export default handleCleanBindingTask;
