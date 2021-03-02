import MicrosoftClient from "../helpers/MicrosoftClient"

export default async function getCalendars() {
  const oauth2Client = MicrosoftClient.Connection
  const authCodeUrlParameters = {
    scopes: ["user.read"],
    redirectUri: "http://localhost:3000/outlookRedirect",
  }
  try {
    console.log("GDFHGJF")

    console.log(
      await oauth2Client.loginPopup({
        redirectUri: authCodeUrlParameters.redirectUri,
        scopes: authCodeUrlParameters.scopes,
      })
    )

    //return oauth2Client.getAuthCodeUrl(authCodeUrlParameters)
  } catch (e) {
    console.log(e)
    console.error("ERROR")
  }
}
