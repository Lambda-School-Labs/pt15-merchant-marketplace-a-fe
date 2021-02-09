import axios from 'axios';

// we will define a bunch of API calls here.

const sellerId = JSON.parse(localStorage.getItem('okta-token-storage'));
// console.log('seller id', sellerId.idToken.claims.sub);

const apiUrl = `${process.env.REACT_APP_API_URI}/profiles`;
const apiUrlId = `${process.env.REACT_APP_API_URI}/profiles/${sellerId.idToken.claims.sub}`;

const sleep = time =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

const getExampleData = () => {
  return axios
    .get(`https://jsonplaceholder.typicode.com/photos?albumId=1`)
    .then(response => response.data);
};

const getAuthHeader = authState => {
  console.log('authheader', authState.idToken);
  if (!authState.isAuthenticated) {
    throw new Error('Not authenticated');
  }
  return { Authorization: `Bearer ${authState.idToken}` };
};

const getDSData = (url, authState) => {
  // here's another way you can compose together your API calls.
  // Note the use of GetAuthHeader here is a little different than in the getProfileData call.
  const headers = getAuthHeader(authState);
  if (!url) {
    throw new Error('No URL provided');
  }
  return axios
    .get(url, { headers })
    .then(res => res.data)
    .catch(err => err);
};

const apiAuthGet = authHeader => {
  return axios.get(apiUrl, { headers: authHeader });
};

const apiAuthGetId = authHeader => {
  return axios.get(apiUrlId, { headers: authHeader });
};

const getProfileData = authState => {
  try {
    return apiAuthGetId(getAuthHeader(authState)).then(
      response => response.data
    );
  } catch (error) {
    return new Promise(() => {
      console.log(error);
      return [];
    });
  }
};

const getProfileIdData = authState => {
  try {
    return apiAuthGetId(getAuthHeader(authState)).then(
      response => response.data
    );
  } catch (error) {
    return new Promise(() => {
      console.log(error);
      return [];
    });
  }
};

const postData = (url, newData, authState) => {
  // here's another way you can compose together your API calls.
  // Note the use of GetAuthHeader here is a little different than in the getProfileData call.
  const headers = getAuthHeader(authState);
  if (!url) {
    throw new Error('No URL provided');
  }
  return axios
    .post(url, newData, { headers })
    .then(res => JSON.parse(res.data))
    .catch(err => err);
};

export {
  sleep,
  getExampleData,
  getProfileData,
  getProfileIdData,
  getDSData,
  postData,
};
