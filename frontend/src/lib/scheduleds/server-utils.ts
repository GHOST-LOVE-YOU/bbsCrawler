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
async function calculateNextRunTime(cron: string) {
  const job = schedule.scheduleJob(cron, () => {});
  return job.nextInvocation();
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
        nextRun: nextRun,
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
