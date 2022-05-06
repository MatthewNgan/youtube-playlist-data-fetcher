const KEY = process.env.GOOGLE_API_KEY;

export default async function handler(req, res) {

  const Q = JSON.parse(req.body).term;

  // uncomment the below for production
  // const fetch_url = `https://www.googleapis.com/youtube/v3/search?q=${Q}&key=${KEY}&part=snippet&type=channel&maxResults=15`;
  // const api_res = await fetch(fetch_url);
  // const data = await api_res.json();

  // for dev only:
  // using local file instead of real data
  // to reduce the usage of the quota
  const data = require('./loc_res.json')

  
  res.json(data);
}