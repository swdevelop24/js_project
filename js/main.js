// import { clientId } from "./keys.js";
// // import { clientSecret } from "./keys.js";


// console.log(`clientId: ${clientId}`);
// console.log(`clientSecret: ${CLIENTSECRET}`);

// const apiKey = process.env.API_KEY;
const apiKey = 'API_KEY';
fetch(`https://developer.nps.gov/api/v1/parks?limit=1&api_key=${apiKey}`)
  .then(response => response.json())
  .then(data => console.log(data.data[0].fullName))
  .catch(error => console.error('Error:', error));
