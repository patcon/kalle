import { Card, Row, Col, Button, Alert } from "react-bootstrap"
import { useState } from "react"
import type { Meeting } from "db"
import { Link, useMutation, invalidateQuery } from "blitz"
import deleteMeetingMutation from "../mutations/deleteMeeting"
import getMeetings from "../queries/getMeetings"
import { format } from "date-fns"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Geo, CalendarRange } from "react-bootstrap-icons"
import { formatMeetingHref } from "../utils/format-meeting-href"

interface MeetingsProps {
  meetings: Meeting[]
}

const Meetings = (props: MeetingsProps) => {
  const [deleteMeeting] = useMutation(deleteMeetingMutation)
  const [activeMeeting, setActiveMeeting] = useState(0)
  const [message, setMessage] = useState("")

  const submitDeletion = async (meetingId: number) => {
    const result = await deleteMeeting(meetingId)
    if (result === "error") {
      setActiveMeeting(meetingId)
      setMessage("There are still active bookings")
    } else {
      invalidateQuery(getMeetings)
    }
  }

  const { meetings } = props
  if (meetings.length < 1) {
    return <p>No Meetings available</p>
  }

  return (
    <Row style={{ display: "flex", flexWrap: "wrap" }}>
      {meetings.map((meeting) => {
        return (
          <Col
            key={meeting.id + "meetingView"}
            sm={6}
            lg={4}
            style={{ display: "flex" }}
            className="my-1"
          >
            <Card
              key={meeting.id + meeting.ownerName + meeting.name}
              id={"" + meeting.id}
              className="p-3 my-2 text-left shadow"
              style={{ width: "100%" }}
            >
              <Row>
                <Col xs={7}>
                  <h5 className="font-weight-bold">
                    {meeting.name} ({meeting.duration}min){" "}
                  </h5>
                </Col>
                <Col xs={5}>
                  <Button
                    className="float-right"
                    variant="outline-danger"
                    onClick={() => {
                      submitDeletion(meeting.id)
                    }}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
              <Row className="mt-1">
                <Col className="my-auto pb-1">
                  <p className="my-auto">
                    <CalendarRange className="mr-2"></CalendarRange>
                    {format(meeting.startDateUTC, "dd.MM.yyy")} -{" "}
                    {format(meeting.endDateUTC, "dd.MM.yyy")}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col className="my-auto pb-1">
                  <p className="my-auto">
                    {meeting.location ? <Geo className="mr-2"></Geo> : ""}
                    {meeting.location}
                  </p>
                </Col>
              </Row>
              <Row className="mt-1">
                <Col>
                  <p className="my-auto">{meeting.description}</p>
                </Col>
              </Row>
              {activeMeeting === meeting.id && message !== "" && (
                <Alert variant="danger" className="mt-4">
                  {message}
                </Alert>
              )}
              <div className="d-flex mt-4 justify-content-end">
                <Link href={"/meeting/bookings/" + meeting.id}>
                  <Button id={"booking-btn-" + meeting.name} variant="outline-primary">
                    View Bookings
                  </Button>
                </Link>
                <CopyToClipboard text={formatMeetingHref(meeting)} className="ml-3">
                  <Button variant="outline-primary">Copy Link</Button>
                </CopyToClipboard>
              </div>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

export default Meetings
