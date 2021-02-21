import Layout from "app/layouts/Layout"
import ConnectedCalendars from "app/users/components/ConnectedCalendars"
import SectionHeader from "app/users/components/SectionHeader"
import { BlitzPage, useQuery } from "blitz"
import React, { Suspense, useState } from "react"
import getConnectedCalendars from "../queries/getConnectedCalendars"

import Skeleton from "react-loading-skeleton"
import AuthError from "app/components/AuthError"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import MyCalendars from "app/users/components/MyCalendars"
import CalendarSettings from "app/users/components/CalendarSettings"

const CalendarList = () => {
  const [calendarEntries] = useQuery(getConnectedCalendars, null)
  const [showAddCalendarModal, setShowAddCalendarModal] = useState(false)

  return (
    <div>
      <MyCalendars />
      <CalendarSettings />
    </div>
  )
}

const CalendarsContent = () => {
  if (!useCurrentUser()) {
    return <AuthError />
  }

  return (
    <>
      <CalendarList />
    </>
  )
}

const Calendars: BlitzPage = () => {
  return (
    <Suspense fallback={<Skeleton count={10} />}>
      <CalendarsContent />
    </Suspense>
  )
}

Calendars.getLayout = (page) => <Layout title="Calendars | Kalle">{page}</Layout>

export default Calendars
