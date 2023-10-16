const express = require('express');
const app = express();
const request = require('request');
const axios = require('axios');
const geohash = require('ngeohash');
const cors = require('cors');
const { json } = require('express');
const path = require("path");

const TICKETMASTER_API_KEY = "FzUucPDqpjq3Y4E0IqIrdM9BFuHmJAEi";


// Use in searchFormData which is for events-search
function googleGeo(location) {
  const geoKey = 'AIzaSyCbF7-MBwO2GFg3qP-0VTk1n-DJIfcWuT8';
  const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${geoKey}`;

  return axios.get(geoUrl)
    .then(response => {
      const geoData = response.data;
      // let latitude;
      // let longitude;
      if (geoData.results.length != 0) {
        const latitude = geoData.results[0].geometry.location.lat;
        const longitude = geoData.results[0].geometry.location.lng;
        const newLocation = geohash.encode(latitude, longitude, 7);
        return newLocation;
      } else {
        return "There is no location named this!";
      }
      // console.log(latitude, longitude)
      // console.log("这是坐标：" + newLocation)
    })
    .catch(error => {
      console.log("Google geo request fail!!!")
      return "There is no location named this!";
    });
}

// For events-search
async function searchFormData(keyword, distance, category, location) {
  location = await googleGeo(location);
  if (location == "There is no location named this!") {
    let searchResult = [];
    return searchResult;
  }
  // connect with words in ticketmaster api
  const keywordUrl = "&keyword=" + keyword;
  let segmentId = '';
  if (category == "Default") {
    segmentId = "&segmentId=";
  } else {
    if (category == "Music") {
      segmentId = "&segmentId=KZFzniwnSyZfZ7v7nJ";
    }
    if (category == "Sports") {
      segmentId = "&segmentId=KZFzniwnSyZfZ7v7nE";
    }
    if (category == "Arts & Theatre") {
      segmentId = "&segmentId=KZFzniwnSyZfZ7v7na";
    }
    if (category == "Film") {
      segmentId = "&segmentId=KZFzniwnSyZfZ7v7nn";
    }
    if (category == "Miscellaneous") {
      segmentId = "&segmentId=KZFzniwnSyZfZ7v7n1";
    }
  }
  const geoPoint = "&geoPoint=" + location;
  const radius = "&radius=" + distance;
  const ticketmasterKey = "&apikey=FzUucPDqpjq3Y4E0IqIrdM9BFuHmJAEi";
  const ticketmasterUrl = "https://app.ticketmaster.com/discovery/v2/events.json?" + keywordUrl + segmentId + geoPoint + radius + "&unit=miles" + ticketmasterKey + "&sort=date,asc";

  if (geoPoint == undefined || radius == undefined || keywordUrl == undefined) {
    return [];
  }
  console.log(ticketmasterUrl)

  return await axios.get(ticketmasterUrl)
    .then(response => {
      const eventsResult = response.data;
      try {
        const key_embedded = eventsResult._embedded
        try {
          const venueDetailList = key_embedded.events
          return venueDetailList;
        } catch (error) {
          console.log("No events array means no results!!!")
          return [];
        }
      } catch (error) {
        console.log("No _embedded means no results!!!")
        return [];
      }
    })
    .catch(error => {
      console.log("Ticketmaster event requets fail!!!")
      return [];
    });
}

//Allow CORS
app.use(cors());

// define route for '/events-search' endpoint
app.get('/events-search', async (req, res) => {
  const keyword = req.query.keyword;
  const distance = req.query.distance;
  const category = req.query.category;
  const location = req.query.location;
  const jsonData = await searchFormData(keyword, distance, category, location);
  res.json(jsonData);
});

app.get('/auto-complete', async (req, res) => {
  const word = req.query.word;
  const apiUrl = `https://app.ticketmaster.com/discovery/v2/suggest?apikey=${TICKETMASTER_API_KEY}&keyword=${word}`;
  const jsonData = await axios.get(apiUrl)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log("Autocomplete request fail!!!")
    });
  //   console.log(jsonData);
  res.json(jsonData);
});

app.get('/events-detail', async (req, res) => {
  const eventId = req.query.word;
  const apiKey = "FzUucPDqpjq3Y4E0IqIrdM9BFuHmJAEi";
  const url = `https://app.ticketmaster.com/discovery/v2/events/${eventId}?apikey=${apiKey}&locale=en`;
  await axios.get(url)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.log("Find event details fail!!!");
      res.json({});
    });
});

app.get('/spotifyArtist', async (req, res) => {

  const SpotifyWebApi = require('spotify-web-api-node');
  const clientId = 'bc7b133ec35d40f08a08bcb9285fa319', clientSecret = 'a1b9c6acf9124434b4ee65b869b31ceb';

  // Create the api object with the credentials
  let spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
  });

  // Retrieve an access token.
  spotifyApi.clientCredentialsGrant().then(
    function (data) {
      // console.log('The access token expires in ' + data.body['expires_in']);
      // console.log('The access token is ' + data.body['access_token']);
      spotify_token = data.body['access_token'];

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi
        .searchArtists(req.query.name)
        .then(function (data) {
          // console.log('Search artists by "Love"', data.body);
          // console.log('Status code:', data.statusCode);
          res.json(data.body);
        })
        .catch(async function (err) {
          console.log("Fail to get api!");
        });

    },
    function (err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );
});

app.get('/spotifyArtistAlbums', async (req, res) => {
  const SpotifyWebApi = require('spotify-web-api-node');
  const clientId = 'bc7b133ec35d40f08a08bcb9285fa319', clientSecret = 'a1b9c6acf9124434b4ee65b869b31ceb';
  // Create the api object with the credentials
  let spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
  });

  // Retrieve an access token.
  spotifyApi.clientCredentialsGrant().then(
    function (data) {
      // console.log('The access token expires in ' + data.body['expires_in']);
      // console.log('The access token is ' + data.body['access_token']);
      spotify_token = data.body['access_token'];
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi
        .getArtistAlbums(req.query.id, { limit: 3 })
        .then(function (data) {
          res.json(data.body);
        })
        .catch(async function (err) {
          console.log("Fail to get album!");
        });
    },
    function (err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );
});

app.get('/venueDetail', async (req, res) => {
  const venueName = req.query.venue;
  url = "https://app.ticketmaster.com/discovery/v2/venues?apikey=FzUucPDqpjq3Y4E0IqIrdM9BFuHmJAEi&keyword=" + venueName;
  await axios.get(url)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.log("Find venue details fail!!!");
      res.json({});
    });
});

app.use(express.static(path.join(__dirname, 'dist/work8-anguler')));
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname, 'dist/work8-anguler/index.html'));
});

app.listen(4000, () => {
  console.log('Server is listening on port 8080');
});
