import "server-only";

async function handleHellolTask() {
  try {
    console.log('开始执行爬虫任务');
    // 模拟爬虫任务
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('爬虫任务执行成功');
    return { success: true, data: '爬虫任务执行成功' };
} catch (error) {
    console.error('Error executing crawl task:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export default handleHellolTask;
