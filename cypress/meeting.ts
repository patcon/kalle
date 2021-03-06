import { createFullSchedule } from "./schedule"
import { url } from "./support/url"
import * as uuid from "uuid"
import { addDays, format } from "date-fns"

export function createMeeting(meetingName: string, meetingLink: string): void {
  cy.visit(url("/meetings"))
  cy.contains("Create new Meeting").click()
  cy.wait(2000)
  cy.get("#name").type(meetingName)
  cy.get("#link").clear()
  cy.get("#link").type(meetingLink)
  cy.get("#description").type("Lorem ipsum, dolor sit amet.")
  cy.get("#location").type("Berlin")
  cy.get("#submit").click()
  cy.get("#duration-30").click()
  let date = new Date()
  const dateStart = format(date, "dd.MM.y")
  const dateEnd = format(addDays(date, 90), "dd.MM.y")
  cy.get("#range-start").clear().type(dateStart)
  cy.get("#range-end").clear().type(dateEnd)
  const scheduleName = uuid.v4()
  createFullSchedule(scheduleName)
  cy.wait(2000)
  cy.get("#select-schedule").select(scheduleName)
  cy.get("#submit").click()
  cy.wait(1000)
  cy.get("#submit").click()
}
