import { Button } from "react-bootstrap"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons"
import { DefaultCalendarSelector } from "../../../users/components/DefaultCalendarSelector"
import getDefaultCalendarByUser from "../../../users/queries/getDefaultCalendarByUser"
import { useQuery } from "blitz"
import { Meeting } from "app/meetings/types"
type AdvancedProps = {
  initialMeeting: Meeting
  stepBack: () => void
  onSubmit: (defaultCalendarId: number) => void
}
const AdvancedStep = (props: AdvancedProps) => {
  let [getDefaultCalendar] = useQuery(getDefaultCalendarByUser, null)
  const [defaultCalendarId, setDefaultCalendarId] = useState(
    getDefaultCalendar ? getDefaultCalendar : -1
  )

  useEffect(() => {
    setDefaultCalendarId(props.initialMeeting.defaultConnectedCalendarId)
  }, [])

  return (
    <div className="p-3 m-3">
      <h4>Advanced Options</h4>
      <p className="pb-3">Specify advanced options for you meeting</p>
      <DefaultCalendarSelector
        onChange={(selectedDefaultCalendarId) => setDefaultCalendarId(selectedDefaultCalendarId)}
      />
      <div className="p-3 d-flex justify-content-end">
        <Button onClick={props.stepBack} className="mx-1">
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        </Button>
        <Button
          onClick={() => {
            props.onSubmit(defaultCalendarId)
          }}
          variant="success"
          id="submit"
          className="mx-1"
          disabled={!defaultCalendarId || defaultCalendarId === -1}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

export default AdvancedStep
