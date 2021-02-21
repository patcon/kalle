import { BlitzPage, Link, Router, useMutation, useQuery } from "blitz"
import React, { ReactElement, Suspense, useState } from "react"
import Advanced from "../../components/creationSteps/Advanced"
import Availability from "../../components/creationSteps/Availability"
import General from "../../components/creationSteps/General"
import ScheduleStep from "../../components/creationSteps/Schedule"
import { Meeting } from "app/meetings/types"
import addMeetingMutation from "../../mutations/addMeeting"
import Layout from "app/layouts/Layout"
import Card from "react-bootstrap/Card"
import { Button, Modal } from "react-bootstrap"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { getOrigin } from "utils/generalUtils"
import getScheduleNames from "app/meetings/queries/getScheduleNames"
import Skeleton from "react-loading-skeleton"
import AuthError from "app/components/AuthError"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import hasCalendar from "app/meetings/queries/hasCalendar"

enum Steps {
  General,
  Schedule,
  Availability,
  Advanced,
}

const initialMeeting: Meeting = {
  name: "",
  link: "",
  description: "",
  duration: 15,
  startDate: new Date(),
  endDate: new Date(),
  location: "",
  scheduleId: 0,
}

interface SuccessModalProps {
  show: boolean
  setShow: (val: boolean) => void
  meetingLink: string
}

const SuccessModal = (props: SuccessModalProps): ReactElement => {
  const close = () => {
    props.setShow(false)
    Router.push(`/meetings`)
  }
  return (
    <Modal show={props.show} onHide={() => close()}>
      <Modal.Header closeButton>
        <Modal.Title>Meeting successfully created!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Your invitelink is: {props.meetingLink}
        <br></br>
        Copy it and send it to your customers or friends
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => close()}>
          Close
        </Button>
        <CopyToClipboard text={props.meetingLink}>
          <Button variant="primary" onClick={() => close()}>
            Copy to Clipboard
          </Button>
        </CopyToClipboard>
      </Modal.Footer>
    </Modal>
  )
}

const InviteCreationContent = () => {
  const [step, setStep] = useState(Steps.General)

  const [meeting, setMeeting] = useState(initialMeeting)
  const [meetingLink, setMeetingLink] = useState("")
  const [showSuccess, setShow] = useState(false)
  const [createMeeting] = useMutation(addMeetingMutation)
  const [schedulePresets] = useQuery(getScheduleNames, null)
  const user = useCurrentUser()
  const [userHasCalendar] = useQuery(hasCalendar, null)

  if (!user) {
    return <AuthError />
  }

  if (!userHasCalendar) {
    return (
      <>
        <h3>Whoa someone seems to be in a rush there</h3>
        <h4>... but first things first!</h4>
        <p>
          In order to create a new meeting you should connect a calendar first. So make sure to head
          over to the calendars page and add your personal calendars
        </p>
        <p>
          <b>FAQ: Can't I just create a Meeting withou connecteing my calendar?</b>
          Sorry this is a feature that is still in work. Currently we need to save appointments to
          your calendar in order to prevent double bookings
        </p>
        <Link href="/calendars">
          <Button variant="primary">To my Calendars</Button>
        </Link>
      </>
    )
  }

  const submitMeeting = async () => {
    try {
      const data = await createMeeting(meeting)
      const link = getOrigin() + "/schedule/" + data?.ownerName + "/" + data?.link
      setMeetingLink(link)
      setShow(true)
    } catch (error) {
      alert(error)
    }
  }

  const next = () => {
    setStep((oldStep) => oldStep + 1)
  }

  const stepBack = () => {
    setStep((oldStep) => oldStep - 1)
  }

  const renderSwitch = () => {
    switch (step) {
      case Steps.General:
        return (
          <General
            userName={user.name.replace(/\s+/g, "-")}
            toNext={(result) => {
              setMeeting((oldMeeting) => ({
                ...oldMeeting,
                name: result.name,
                location: result.location,
                description: result.description,
                link: result.link,
              }))

              next()
            }}
          />
        )
      case Steps.Schedule:
        return (
          <ScheduleStep
            schedulePresets={schedulePresets!}
            toNext={(result) => {
              setMeeting((oldMeeting) => ({
                ...oldMeeting,
                startDate: result.startDate,
                endDate: result.endDate,
                scheduleId: result.scheduleId,
                duration: result.duration,
              }))
              next()
            }}
            stepBack={stepBack}
          />
        )
      case Steps.Availability:
        return <Availability toNext={next} stepBack={stepBack} />
      case Steps.Advanced:
        return <Advanced onSubmit={submitMeeting} stepBack={stepBack} />
    }
  }

  return (
    <>
      <Card>{renderSwitch()}</Card>
      <SuccessModal show={showSuccess} setShow={setShow} meetingLink={meetingLink} />
    </>
  )
}

const Create: BlitzPage = () => {
  return (
    <Suspense fallback={<Skeleton count={10} />}>
      <InviteCreationContent />
    </Suspense>
  )
}

Create.getLayout = (page) => <Layout title="Create a Meeting">{page}</Layout>

export default Create
