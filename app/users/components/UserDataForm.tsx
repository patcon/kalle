import { useCurrentUser } from "app/hooks/useCurrentUser"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"

interface UserDataFormProps {
  state: string
  message: string
  setName: (args: any) => void
  setEmail: (args: any) => void
  setPassword: (args: any) => void
  setRepeatPassword: (args: any) => void
}

const UserDataForm = (props: UserDataFormProps) => {
  const currentUser = useCurrentUser()
  return (
    <Form className="m-3">
      <Form.Group controlId="formName">
        <Form.Label>Full name</Form.Label>
        <Form.Control
          autoComplete="name"
          placeholder={currentUser?.name}
          onChange={(e) => props.setName(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          autoComplete="email"
          type="email"
          placeholder={currentUser?.email}
          onChange={(e) => props.setEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Row>
        <Form.Group as={Col} controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            autoComplete="new-password"
            type="password"
            onChange={(e) => props.setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="formRepeatPassword">
          <Form.Label>Repeat Password</Form.Label>
          <Form.Control
            autoComplete="new-password"
            type="password"
            onChange={(e) => props.setRepeatPassword(e.target.value)}
          />
        </Form.Group>
      </Form.Row>
      <Form.Text className={props.state + " mb-4"}>{props.message}</Form.Text>
    </Form>
  )
}

export default UserDataForm
