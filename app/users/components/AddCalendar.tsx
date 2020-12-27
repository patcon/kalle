import addConnectedCalendarMutation from "../mutations/addConnectedCalendar"
import { invalidateQuery, useMutation, invoke } from "blitz"
import authenticateConnectedCalendar from "../queries/authenticateConnectedCalendar"
import getConnectedCalendars from "../queries/getConnectedCalendars"
import Form from "react-bootstrap/Form"
import styles from "../styles/AddCalendar.module.css"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"

interface AddCalendarProps {
  onClose(): void
}

const AddCalendar = (props: AddCalendarProps) => {
  const [createCalendar] = useMutation(addConnectedCalendarMutation)

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <Card>
          <div className="text-center px-4 pt-5">
            <h5 className="font-weight-bold">Add Calendar</h5>
          </div>
          <Form
            className="p-4"
            onSubmit={async (evt) => {
              evt.preventDefault()

              const form = new FormData(evt.currentTarget)

              const type = form.get("type") as string
              const url = form.get("url") as string
              const name = form.get("name") as string
              const password = form.get("password") as string
              const username = form.get("username") as string

              if (type !== "CalDav") {
                alert("Type currently not supported")
                return
              }

              const response = await invoke(authenticateConnectedCalendar, {
                url,
                username,
                password,
              })
              if (response.fail !== null) {
                alert("Invalid Credentials")
                return
              }

              await createCalendar({
                name,
                password,
                type,
                url,
                username,
              })
              await invalidateQuery(getConnectedCalendars)

              props.onClose()
            }}
          >
            <Form.Group controlId="formName">
              <Form.Label>Calendar name</Form.Label>
              <Form.Control name="name" />
            </Form.Group>
            <Form.Group controlId="formUrl">
              <Form.Label>Calendar URL</Form.Label>
              <Form.Control name="url" type="url" />
            </Form.Group>
            <Form.Group controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Control as="select" name="type">
                <option>CalDav</option>
                <option>Google Calendar</option>
                <option>Microsoft Outlook</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control name="username" />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" />
            </Form.Group>
            <div className="p-3 d-flex justify-content-end">
              <Button variant="outline-primary" className="mx-1" onClick={props.onClose}>
                Cancel
              </Button>
              <Button variant="primary" className="mx-1" type="submit">
                Add
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default AddCalendar
