import {
  getEvents,
  verifyConnectionDetails,
  formatDateAsICS,
  CaldavService,
} from "./caldav-service"
import { GenericContainer, StartedTestContainer } from "testcontainers"
import * as path from "path"
import { addMinutes } from "date-fns"
import execa from "execa"

// for some reason, testcontainer's build doesn't want to work.
// that's why we build it by hand ...
async function buildByHand(context: string, name: string) {
  await execa("docker", ["buildx", "build", "-t", name, "."], {
    cwd: path.resolve(__dirname, context),
  })
}

async function getBaikalContainer() {
  await buildByHand("../../../test/baikal", "baikal-with-cal")
  return new GenericContainer("baikal-with-cal").withExposedPorts(80)
}

async function getNextcloudContainer() {
  await buildByHand("../../../test/nextcloud", "nc-with-cal")
  return new GenericContainer("nc-with-cal").withExposedPorts(80)
}

type Backends = "Baikal" | "Nextcloud"

function test(calendarBackend: Backends) {
  function switchByCalendar<T>(values: Record<Backends, T>): T {
    return values[calendarBackend]
  }

  describe("caldav stuff > " + calendarBackend, () => {
    let baseUrl: string

    let calendarBackend: StartedTestContainer

    beforeAll(async () => {
      jest.setTimeout(120 * 1000)

      const calendarBackendContainer = await switchByCalendar({
        Baikal: getBaikalContainer,
        Nextcloud: getNextcloudContainer,
      })()
      calendarBackend = await calendarBackendContainer.start()

      baseUrl = `http://${calendarBackend.getHost()}:${calendarBackend.getMappedPort(80)}`
    })

    afterAll(async () => {
      await calendarBackend.stop()
    })

    function getCalendarConnection() {
      return switchByCalendar({
        Baikal: {
          url: baseUrl + "/dav.php/calendars/john.doe/test",
          auth: {
            username: "john.doe",
            password: "root",
            digest: true,
          },
        },
        Nextcloud: {
          url: baseUrl + "/remote.php/dav/calendars/admin/personal",
          auth: {
            username: "admin",
            password: "root",
            digest: false,
          },
        },
      })
    }

    function getCaldavService() {
      return new CaldavService(getCalendarConnection())
    }

    describe("auth test", () => {
      describe("when given invalid credentials", () => {
        it("returns unauthorized", async () => {
          const {
            url,
            auth: { username },
          } = getCalendarConnection()
          await expect(verifyConnectionDetails(url, username, "wrong-password")).resolves.toEqual({
            fail: "unauthorized",
          })
        })
      })

      describe("when given non-existant url", () => {
        it("returns wrong_url", async () => {
          await expect(
            verifyConnectionDetails("http://non-existant-calendar.com/", "john.doe", "root")
          ).resolves.toEqual({ fail: "wrong_url" })
        })
      })

      describe("when given non-caldav url", () => {
        it("returns no_caldav_support", async () => {
          await expect(
            verifyConnectionDetails("https://google.com/", "john.doe", "root")
          ).resolves.toEqual({ fail: "no_caldav_support" })
        })
      })

      // We can use https://tools.ietf.org/html/rfc4791#section-6.2.1 to implement this,
      // but Baikal doesn't support it.
      describe.skip("when given valid webdav url, but not a calendar resource", () => {
        it("returns the normalised caldav base URL", async () => {
          await expect(
            verifyConnectionDetails(baseUrl + "/dav.php/john.doe", "john.doe", "root", true)
          ).resolves.toEqual({
            fail: null,
            caldavBaseUrl: "http://localhost:5232/dav.php/calendars/john.doe/test",
          })
        })
      })

      describe("when given an url without a protocol", () => {
        it("assumes https and fails b/c Baikal doesnt support it", async () => {
          const {
            url,
            auth: { username, password },
          } = getCalendarConnection()
          await expect(
            verifyConnectionDetails(url.replace("http://", ""), username, password)
          ).resolves.toEqual({
            fail: "wrong_protocol",
          })
        })
      })

      describe("when given valid details", () => {
        it("returns the connection details including the correct auth method", async () => {
          const {
            auth: { username, password },
            url,
          } = getCalendarConnection()
          await expect(verifyConnectionDetails(url, username, password, true)).resolves.toEqual({
            fail: null,
            connectionDetails: {
              url,
              auth: {
                username: username,
                password: password,
                digest: switchByCalendar({ Nextcloud: false, Baikal: true }),
              },
            },
          })
        })
      })
    })

    describe("freeBusy", () => {
      it("without events", async () => {
        const result = await getCaldavService().getTakenTimeSlots(
          new Date("2020-11-16T00:00:00.000Z"),
          new Date("2020-11-21T00:00:00.000Z")
        )
        const expected = []
        expect(result).toEqual(expected)
      })
      it("with events", async () => {
        const result = await getCaldavService().getTakenTimeSlots(
          new Date("2020-11-23T00:00:00.000Z"),
          new Date("2020-11-28T00:00:00.000Z")
        )
        const expected = [
          {
            start: new Date("2020-11-25T11:00:00.000Z"),
            end: new Date("2020-11-25T13:00:00.000Z"),
          },
          {
            start: new Date("2020-11-25T19:00:00.000Z"),
            end: new Date("2020-11-25T22:00:00.000Z"),
          },
          {
            start: new Date("2020-11-26T09:00:00.000Z"),
            end: new Date("2020-11-26T11:00:00.000Z"),
          },
        ]
        expect(result).toContainEqual(expected[0])
        expect(result).toContainEqual(expected[1])
        expect(result).toContainEqual(expected[2])
      })
    })

    describe("events", () => {
      it("without events", async () => {
        const result = await getEvents(
          getCalendarConnection(),
          new Date("2020-11-16T00:00:00.000Z"),
          new Date("2020-11-21T00:00:00.000Z")
        )
        const expected = []
        expect(result).toEqual(expected)
      })
      it("with events", async () => {
        const result = await getEvents(
          getCalendarConnection(),
          new Date("2020-11-23T00:00:00.000Z"),
          new Date("2020-11-28T00:00:00.000Z")
        )
        const expected = [
          {
            title: "Lunch",
            start: new Date("2020-11-25T11:00:00.000Z"),
            end: new Date("2020-11-25T13:00:00.000Z"),
          },
          {
            title: "Geburtstag",
            start: new Date("2020-11-25T19:00:00.000Z"),
            end: new Date("2020-11-25T22:00:00.000Z"),
          },
          {
            title: "Meeting",
            start: new Date("2020-11-26T09:00:00.000Z"),
            end: new Date("2020-11-26T11:00:00.000Z"),
          },
        ]
        expect(result).toContainEqual(expected[0])
        expect(result).toContainEqual(expected[1])
        expect(result).toContainEqual(expected[2])
      })
    })

    describe("create event", () => {
      it("basic event", async () => {
        const date = new Date()
        await getCaldavService().createEvent({
          startDateUTC: date,
          meeting: {
            location: "Frankfurt",
            duration: 30,
            name: "DummyEvent",
            description: "This is a dummy event!",
            owner: {
              email: "some@owner.de",
            },
          },
          inviteeEmail: "some@invitee.de",
        })

        const events = await getEvents(getCalendarConnection(), date, addMinutes(date, 30))

        date.setMilliseconds(0)

        const expected = {
          title: "DummyEvent",
          start: date,
          end: addMinutes(date, 30),
        }
        expect(events).toContainEqual(expected)
      })
    })
  })
}

test("Baikal")
test("Nextcloud")

it("formatDateAsICS", () => {
  expect(formatDateAsICS(new Date("2021-02-11T15:02:33.944Z"))).toBe("20210211T150233Z")
  expect(formatDateAsICS(new Date("2021-02-11T15:02:33.944+01:00"))).toBe("20210211T140233Z")
})
