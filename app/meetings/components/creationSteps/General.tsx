import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons"
import { Form, Button } from "react-bootstrap"
import { Link } from "blitz"
import { useState } from "react"
import { GeneralInformationInput } from "app/auth/validations"

interface GeneralFormResult {
  name: string
  link: string
  location: string
  description: string
}

type GeneralProps = {
  toNext: (result: GeneralFormResult) => void
}

const General = (props: GeneralProps) => {
  const [message, setMessage] = useState("")
  return (
    <div className="p-3">
      <h4>General Information</h4>
      <p className="pb-3">Add basic information about the meeting</p>
      <Form
        className="m-3"
        onSubmit={(evt) => {
          evt.preventDefault()

          const formData = new FormData(evt.currentTarget)
          const name = formData.get("name") as string
          const description = formData.get("description") as string
          const link = formData.get("link") as string
          const location = formData.get("location") as string

          const parseResult = GeneralInformationInput.safeParse({
            name,
            description,
            link,
            location,
          })

          if (!parseResult.success) {
            setMessage(parseResult.error.errors[0].message)
            return
          }

          props.toNext({
            name: name,
            description: description,
            location: location,
            link: link,
          })
        }}
      >
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" />
        </Form.Group>
        <Form.Group controlId="link">
          <Form.Label>Invite Link</Form.Label>
          <Form.Control name="link" />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} name="description" />
        </Form.Group>
        <Form.Group controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control name="location" />
        </Form.Group>
        <Form.Text className="text-danger">{message}</Form.Text>
        <div className="p-3 d-flex justify-content-end">
          <Link href="/meetings">
            <Button className="mx-1">Cancel</Button>
          </Link>
          <Button id="submit" type="submit">
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default General
