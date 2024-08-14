// lib/scheduler.js
import schedule from "node-schedule";
import executeTask from "./executeTask";
import prisma from "./db";

export async function startScheduledTasks() {
  const tasks = await prisma.scheduledTask.findMany();
  tasks.forEach((task) => {
    schedule.scheduleJob(task.name, task.cron, () => {
      executeTask(task);
    });
  });
}
