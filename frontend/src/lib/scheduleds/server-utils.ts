import "server-only";

import { ScheduledTask } from "@prisma/client";
import schedule from "node-schedule";
import prisma from "@lib/db";

type updateTaskStatusProps = {
  task: ScheduledTask;
  success?: boolean;
  startRun?: boolean;
};

// 计算下次运行时间
async function calculateNextRunTime(cron: string): Promise<Date | null> {
  try {
    const job = schedule.scheduleJob(cron, () => {});
    if (job) {
      const nextInvocation = job.nextInvocation();
      job.cancel(); // 取消作业以避免内存泄漏
      return nextInvocation instanceof Date ? nextInvocation : null;
    }
    return null;
  } catch (error) {
    console.error("Error calculating next run time:", error);
    return null;
  }
}

export async function updateTaskStatus({
  task,
  success,
  startRun,
}: updateTaskStatusProps) {
  if (startRun) {
    const nextRun = await calculateNextRunTime(task.cron);
    await prisma.scheduledTask.update({
      where: { id: task.id },
      data: {
        lastRun: new Date(),
        status: "running",
        nextRun: nextRun ? nextRun : undefined,
      },
    });
  } else {
    await prisma.scheduledTask.update({
      where: { id: task.id },
      data: {
        lastStatus: success ? "completed" : "error",
        status: "pending",
      },
    });
  }
}
