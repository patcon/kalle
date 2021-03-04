const tenant = "common"
export const client_id = process.env.MICROSOFTCLIENTID
export const redirect_uri = "http://localhost:3000/outlookRedirect"
export const response_mode = "query"
export const scope =  "offline_access user.read mail.read"
export const response_type = "code"
export const baseURL = "https://login.microsoftonline.com/" + tenant + "/oauth2/v2.0/"
