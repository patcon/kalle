import { BlitzPage, Link, Router } from "blitz"
import Layout from "app/layouts/Layout"
import { PrimaryButton, SecondaryButton, TertiaryButton } from "app/components/buttons"
import { useCurrentUser } from "app/hooks/useCurrentUser"

const Home: BlitzPage = () => {
  function useIsLoggedIn() {
    const currentUser = useCurrentUser()
    return !!currentUser
  }

  return (
    <div className="container mx-auto p-4 mt-5">
      <h1>Kalle.app</h1>
      <p>Ich bin Kalle, dein fischiger Freund, und helfe dir Termine zu plätschern.</p>
      <Link href="/auth/login">
        <PrimaryButton>Log in</PrimaryButton>
      </Link>

      <p>Not registered yet?</p>

      <Link href="/signup">
        <SecondaryButton>Sign up</SecondaryButton>
      </Link>
      <p>Or just bubble a bit...</p>
      <TertiaryButton>Bubble!</TertiaryButton>
    </div>
  )
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
