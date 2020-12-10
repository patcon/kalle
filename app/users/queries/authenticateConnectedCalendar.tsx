import { verifyConnectionDetails } from "app/caldav"

interface AuthenticateCaldavArgs {
  url: string
  username: string
  password: string
}

export default async function authenticateConnectedCalendar(args: AuthenticateCaldavArgs) {
  const res = await verifyConnectionDetails(args.url, args.username, args.password)
  return res
}
