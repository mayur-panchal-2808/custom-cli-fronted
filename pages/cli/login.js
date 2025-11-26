export default function Page() {
  return <div>Redirecting to Auth0...</div>;
}

export async function getServerSideProps({ query }) {
  const token = query.token;
  if (!token) {
    return { props: {} };
  }

  const auth0Domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const redirectUri = process.env.AUTH0_CALLBACK;
  console.log("REDIRECT URI:", redirectUri);

  const scope = "openid profile email";
  const authorizeUrl = `https://${auth0Domain}/authorize?response_type=code&client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(
    scope
  )}&state=${encodeURIComponent(token)}`;

  return {
    redirect: {
      destination: authorizeUrl,
      permanent: false,
    },
  };
}
