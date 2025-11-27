// export default function Page() {
//   return <div>Redirecting to Auth0...</div>;
// }

// export async function getServerSideProps({ query }) {
//   const token = query.token;
//   if (!token) {
//     return { props: {} };
//   }

//   const auth0Domain = process.env.AUTH0_DOMAIN;
//   const clientId = process.env.AUTH0_CLIENT_ID;
//   const redirectUri = process.env.AUTH0_CALLBACK;
//   console.log("REDIRECT URI:", redirectUri);

//   const scope = "openid profile email";
//   const authorizeUrl = `https://${auth0Domain}/authorize?response_type=code&client_id=${encodeURIComponent(
//     clientId
//   )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(
//     scope
//   )}&state=${encodeURIComponent(token)}`;

//   return {
//     redirect: {
//       destination: authorizeUrl,
//       permanent: false,
//     },
//   };
// }

export default function Page() {
  return <div>Redirecting to Auth0...</div>;
}

export async function getServerSideProps({ query }) {
  console.log("=== AUTH0 LOGIN REDIRECT START ==="); // DEBUG LOG

  // Debug raw query
  console.log("QUERY RECEIVED:", query); // DEBUG LOG

  const token = query.token;

  console.log("TOKEN RECEIVED:", token); // DEBUG LOG

  if (!token) {
    console.log("No token found in query. Returning empty props."); // DEBUG LOG
    return { props: {} };
  }

  // Debug environment variables
  console.log("=== ENV DEBUG START ===");
  console.log("AUTH0_DOMAIN:", process.env.AUTH0_DOMAIN);
  console.log("AUTH0_CLIENT_ID:", process.env.AUTH0_CLIENT_ID);
  console.log("AUTH0_CALLBACK:", process.env.AUTH0_CALLBACK);
  console.log(
    "AUTH0_CLIENT_SECRET exists?:",
    !!process.env.AUTH0_CLIENT_SECRET
  );
  console.log("=== ENV DEBUG END ===");

  const auth0Domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const redirectUri = process.env.AUTH0_CALLBACK;

  console.log("REDIRECT URI:", redirectUri); // already present

  const scope = "openid profile email";

  const authorizeUrl = `https://${auth0Domain}/authorize?response_type=code&client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(
    scope
  )}&state=${encodeURIComponent(token)}`;

  // Log the final Auth0 URL
  console.log("AUTH0 AUTHORIZE URL GENERATED:", authorizeUrl);

  console.log("=== REDIRECTING TO AUTH0 NOW ===");

  return {
    redirect: {
      destination: authorizeUrl,
      permanent: false,
    },
  };
}

// Test CI CD
