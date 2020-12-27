import { Slot } from "../types"
import SingleTimeSlot from "./singleTimeSlot"

interface AvailableSlotsProps {
  slots: Slot[]
  selectedDay: Date
  setSelectedTimeSlot: any
  selectedTimeSlot: any
}

function asTwoDigits(number: number) {
  return ("0" + number).slice(-2)
}

export function formatAs24HourClockString(date: Date) {
  return asTwoDigits(date.getHours()) + ":" + asTwoDigits(date.getMinutes())
}

const AvailableTimeSlotsSelection = (props: AvailableSlotsProps) => {
  const timeSlotTiles = props.slots.map((slot, index) => {
    if (
      props.selectedDay.getDate() === slot.start.getDate() &&
      props.selectedDay.getFullYear() === slot.start.getFullYear()
    ) {
      return (
        <div className="w-full d-flex justify-content-center">
          <SingleTimeSlot
            key={index}
            start={formatAs24HourClockString(slot.start)}
            end={formatAs24HourClockString(slot.end)}
            selectedTimeSlot={props.selectedTimeSlot}
            setSelectedTimeSlot={props.setSelectedTimeSlot}
          />
        </div>
      )
    } else {
      return <div></div>
    }
  })

  return (
    <div className="text-center">
      <p className="mb-4">Please select a time slot.</p>
      {timeSlotTiles}
    </div>
  )
}

export default AvailableTimeSlotsSelection
