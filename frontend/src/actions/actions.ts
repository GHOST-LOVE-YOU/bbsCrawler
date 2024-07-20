"use server";

import prisma from "@lib/db";


export async function getScheduledTask(){
    return await prisma.scheduledTask.findMany();
}