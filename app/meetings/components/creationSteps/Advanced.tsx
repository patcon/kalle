import { Button } from "react-bootstrap"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons"
import {
  DefaultCalendarSelector,
  SelectorType,
} from "../../../users/components/DefaultCalendarSelector/DefaultCalendarSelector"
import getDefaultCalendarByUser from "../../../users/queries/getDefaultCalendarByUser"
import { useQuery, invoke } from "blitz"
type AdvancedProps = {
  stepBack: () => void
  onSubmit: (defaultCalendarId: number) => void
}
const AdvancedStep = (props: AdvancedProps) => {
  let [getDefaultCalendar] = useQuery(getDefaultCalendarByUser, null)
  const [defaultCalendarId, setDefaultCalendarId] = useState(
    getDefaultCalendar ? getDefaultCalendar : -1
  )

  return (
    <div className="p-3">
      <h4>Advanced Options</h4>
      <p className="pb-3">Specify advanced options for you meeting</p>
      <DefaultCalendarSelector
        type={SelectorType.meetingBased}
        onChange={(selectedDefaultCalendarId) => {
          setDefaultCalendarId(selectedDefaultCalendarId)
          //TODO: BELOW HANDLE WHEN MEETINGID IS -1
        }}
      />
      <div className="p-3 d-flex justify-content-end">
        <Button onClick={props.stepBack} type="submit" className="mx-1">
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        </Button>
        <Button
          onClick={() => {
            props.onSubmit(defaultCalendarId)
          }}
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
