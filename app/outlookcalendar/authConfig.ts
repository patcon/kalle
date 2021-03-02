/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 * For more details on using MSAL.js with Azure AD B2C, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/working-with-b2c.md
 */

export const msalConfig = {
  auth: {
    clientId: "9516495f-79a2-4e13-860b-4ffebb531f95", // This is the ONLY mandatory field; everything else is optional.
    authority: "https://login.microsoftonline.com/common", // Choose sign-up/sign-in user-flow as your default.
    client_secret: "4g.weYYaKLw6H8fyQT37ZKZ~ur3y.B~y65",
    //knownAuthorities: [b2cPolicies.authorityDomain], // You must identify your tenant's domain as a known authority.
    redirectUri: "http://localhost:3000/test", // You must register this URI on Azure Portal/App Registration. Defaults to "window.location.href".
    scopes: ["offline_access"],
  },
  cache: {
    cacheLocation: "localStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
    storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
  },
}

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: ["openid", "offline_access", "Calendars.ReadWrite"],
  extraScopesToConsent: ["offline_access"],
}

/**
 * Scopes you add here will be used to request a token from Azure AD B2C to be used for accessing a protected resource.
 * To learn more about how to work with scopes and resources, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const tokenRequest = {
  scopes: ["offline_access", "Calendars.ReadWrite"], // e.g. ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"]
  extraScopesToConsent: ["offline_access"],
  forceRefresh: true, // Set this to "true" to skip a cached token and go to the server to get a new token
}
