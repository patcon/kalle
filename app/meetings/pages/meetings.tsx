import Layout from "app/layouts/Layout"
import { BlitzPage, Link, useQuery } from "blitz"
import React, { Suspense } from "react"
import getMeetings from "../../meetings/queries/getMeetings"
import Meetings from "../components/Meetings"
import Button from "react-bootstrap/Button"

const MeetingsContent = () => {
  const [meetings] = useQuery(getMeetings, null)
  return <Meetings meetings={meetings ? meetings : []} />
}

const MainContent = () => {
  // display all meetings I invited to as cards here
  // Customer can click on a meeting and info will be displayed
  return (
    <div className="text-center">
      <h3>All your active Meetings</h3>
      <Suspense fallback="Loading...">
        <MeetingsContent />
      </Suspense>
      <Link href="/meeting/create">
        <Button variant="primary" className="m-3">
          Create new Meeting
        </Button>
      </Link>
    </div>
  )
}

const MyMeetings: BlitzPage = () => {
  return (
    <Suspense fallback="Loading...">
      <MainContent />
    </Suspense>
  )
}

MyMeetings.getLayout = (page) => <Layout title="Meetings">{page}</Layout>

export default MyMeetings
