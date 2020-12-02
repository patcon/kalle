import Button from "./button"
import addConnectedCalendar from "../mutations/addConnectedCalendar"
import AddConnectedCalendar from "./addConnectedCalendar"
import { useState } from "react"
import { useMutation } from "blitz"
import authenticateCalDav from "../utils/authenticateConnectedCalendar"

const initialCalendar = {
  name: "",
  type: "CalDav",
  url: "",
  username: "",
  password: "",
}

type AddCalendarProps = {
  updateCalendarList
  hidden: boolean
}

const AddConnectedCalendarModal = (props: AddCalendarProps) => {
  const [calendar, setCalendar] = useState(initialCalendar)
  const [createCalendarMutation] = useMutation(addConnectedCalendar)

  const handleCalenderInfoChanged = (field, value) => {
    setCalendar({
      ...calendar,
      [field]: value,
    })
  }

  if (props.hidden) {
    return <div></div>
  }

  return (
    <div
      className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div className="mt-5 md:mt-0 md:col-span-2">
        <div className="shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 bg-white sm:p-6">
            <AddConnectedCalendar handleChange={handleCalenderInfoChanged} />
          </div>
          <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              action={async () => {
                let credentialsCorrect = false
                switch (calendar.type) {
                  case "CalDav":
                    credentialsCorrect = authenticateCalDav(
                      calendar.username,
                      calendar.password,
                      calendar.url
                    )
                    break
                  default:
                    alert("Calendartype not supported")
                    return
                }

                if (!credentialsCorrect) {
                  alert("Invalid Credentials")
                  return
                }

                try {
                  await createCalendarMutation(calendar)
                  props.updateCalendarList()
                } catch (error) {
                  alert("Error saving project")
                }
              }}
            >
              Add Calendar
            </Button>
            <button
              type="button"
              className="mt-3 mx-4 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddConnectedCalendarModal
