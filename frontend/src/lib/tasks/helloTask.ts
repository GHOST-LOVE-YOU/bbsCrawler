import "server-only";

async function handleHellolTask() {
  try {
    return { success: true, data: '测试任务执行成功' };
} catch (error) {
    console.error('Error executing crawl task:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export default handleHellolTask;
