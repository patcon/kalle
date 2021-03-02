import { BlitzPage, invoke, useQuery } from "blitz"
import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import createConnection from "../queries/createConnection"
import getOutlookCredentials from "../queries/getOutlookCredentials"
import { Button, Row, Col, Form } from "react-bootstrap"
import getFreeBusySchedule from "../queries/getFreeBusySchedule"
import createCalendarEvent from "../queries/createCalendarEvent"
import { signIn } from "../authRedirect"
const msal = require("@azure/msal-browser")
const config = {
  auth: {
    clientId: "9516495f-79a2-4e13-860b-4ffebb531f95",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:3000/",
    clientSecret: process.env.MICROSOFTCLIENTSECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message)
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
}

const x = new msal.PublicClientApplication(config)
function connect() {
  signIn()
  return
  const authCodeUrlParameters = {
    scopes: ["user.read"],
    redirectUri: "http://localhost:3000/test",
  }
  x.loginRedirect({
    redirectUri: authCodeUrlParameters.redirectUri,
    scopes: authCodeUrlParameters.scopes,
  })
  console.log("DS")
  x.handleRedirectPromise()
    .then((dawd) => {
      console.log(dawd)
    })
    .catch((err) => console.log(err))
  console.log("D")
}

function TestFun() {
  const now = new Date()
  const future = new Date(2021, 0, 26)
  const [url] = useQuery(createConnection, undefined)
  return (
    <>
      <button onClick={() => connect()}>dd</button>
      <Button variant="primary" href={url}>
        createConnection
      </Button>
      <button onClick={() => invoke(getOutlookCredentials, null)}>getCalendarCredentials</button>
      <button
        onClick={async () => {
          try {
            //await invoke(googlequery,{ start: now, end: future })
          } catch (err) {
            console.log(err)
          }
        }}
      >
        sgooglequery
      </button>
      <Button
        onClick={async () =>
          console.log(await invoke(getFreeBusySchedule, { start: now, end: future, userId: 1 }))
        }
      >
        dGet Free Busy{" "}
      </Button>
      <Button onClick={() => invoke(createCalendarEvent, null)}>post event </Button>
    </>
  )
}

const Test: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback="Loading ...">
        <TestFun />
      </Suspense>
    </div>
  )
}

Test.getLayout = (page) => <Layout title="Test">{page}</Layout>

export default Test
