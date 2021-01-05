import db from "db"
import { Ctx } from "blitz"

export default async function addMeeting(scheduleCreate, ctx: Ctx) {
  if (!ctx.session?.userId) return null

  const owner = await db.user.findFirst({
    where: { id: ctx.session.userId },
  })

  if (!owner) return null

  const schedule = await db.schedule.create({
    data: {
      name: scheduleCreate.name,
      owner: {
        connect: { id: owner.id },
      },
    },
  })

  for (const day of Object.keys(scheduleCreate.schedule)) {
    if (scheduleCreate.schedule[day][0] && scheduleCreate.schedule[day][1]) {
      await db.dailySchedule.create({
        data: {
          day: day,
          startTime: scheduleCreate.schedule[day][0],
          endTime: scheduleCreate.schedule[day][1],
          schedule: {
            connect: { id: schedule.id },
          },
        },
      })
    }
  }

  return schedule
}