"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScheduledTask } from "@prisma/client";
import moment from "moment";
import "moment/locale/zh-cn";
import { getScheduledTask } from "@lib/scheduleds/server-utils";
moment.locale("zh-cn");

export default function ScheduledTasksPage() {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const data = await getScheduledTask();
      setTasks(data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch tasks");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4 bg-black rounded-xl my-5 min-h-[600px]">
      <h1 className="text-2xl font-bold mb-4">Scheduled Tasks</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Run</TableHead>
            <TableHead>Last Status</TableHead>
            <TableHead>Next Run</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.name}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>
                {task.lastRun
                  ? new Date(task.lastRun).toLocaleString()
                  : "Never"}
              </TableCell>
              <TableCell>{task.lastStatus || "N/A"}</TableCell>
              <TableCell>
                {task.nextRun
                  ? moment(new Date(task.nextRun)).fromNow()
                  : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
