export async function APIFlow(request) {
  console.log("API flow running...");

  const response = await request.post(
    'https://preauthbackend.vizzafintech.com/auth/token',
    {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        client_id: 'vifin-email-agent',
        client_secret: 'XNCcNStEDCqZCbjd9bkLgO8ulbQDrRznzBci3V0DA-cMXrLJycTprwW8ijY4iCFV'
      }
    }
  );

  const body = await response.json();
  const accessToken = body.access_token;

  // console.log("Access Token:", accessToken);

  const mailResponse = await request.post(
    'https://preauthbackend.vizzafintech.com/email-agent/sync-unread?email_address=insurance%40promedhospital.com',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  const mailBody = await mailResponse.json();
  console.log(mailBody);

  return mailBody;
}