import { updateTaskStatus } from "./scheduleds/server-utils";
import handleCrawlTask from "./tasks/crawlTask";
import handleHellolTask from "./tasks/helloTask";
import handleCleanMessageTask from "./tasks/cleanMessageTask";
import handleCleanBindingTask from "./tasks/cleanBindingTask";
import handleCleanNotifyRuleTask from "./tasks/cleanNotifyRuleTask";

async function executeTask(task: any) {
  let taskHandler;

  // 根据任务名称分配处理函数
  switch (task.name) {
    case "爬虫任务":
      taskHandler = handleCrawlTask;
      break;
    case "测试任务":
      taskHandler = handleHellolTask;
      break;
    case "清理消息":
      taskHandler = handleCleanMessageTask;
      break;
    case "清理绑定":
      taskHandler = handleCleanBindingTask;
      break;
    case "清理通知规则":
      taskHandler = handleCleanNotifyRuleTask;
      break;
    default:
      console.error("未知任务:", task.name);
      return;
  }

  //   更新任务状态为运行中
  await updateTaskStatus({
    task: task,
    startRun: true,
  });

  // 执行任务并处理结果
  const result = await taskHandler();
  if (result.success) {
    console.log(`任务 ${task.name} 执行成功:`);
  } else {
    console.error(`任务 ${task.name} 执行失败:`, result.error);
  }

  await updateTaskStatus({
    task: task,
    success: result.success,
    startRun: false,
  });
}

export default executeTask;
