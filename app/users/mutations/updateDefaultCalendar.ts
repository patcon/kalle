import db from "db"
import { Ctx } from "blitz"

export default async function updateDefaultCalendar(calendarId: number, ctx: Ctx) {
  ctx.session.authorize()
  console.log("GHHJ")
  const owner = await db.user.findFirst({
    where: { id: ctx.session.userId },
  })
  const calendar = await db.connectedCalendar.findFirst({
    where: { id: calendarId },
  })


  if (!owner) {
    throw new Error("Invariant error: Owner does not exist")
  }
  if (!calendar) {
    throw new Error("Invariant error: Calendar does not exist")
  }

  const defaultCalendar = await db.defaultCalendar.findFirst({
    where: { userId: ctx.session.userId },
  })

  if (!defaultCalendar) {
    await db.defaultCalendar.create({
        data: {
            user:  {
                connect: { id: owner.id },
              },
            calendar: {
                connect: { id: calendarId },
              }
        }
      })
  } else {
    await db.defaultCalendar.update({
        where: { id: defaultCalendar.id },
        data: {
            calendar: {
                connect: { id: calendarId },
              },
        }
      })
  }

  return defaultCalendar
}