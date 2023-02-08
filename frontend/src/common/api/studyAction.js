import {axios} from './https'
import { ADDFAVORITES, ALLWORDS, CHECKFAVORITES, DELETEFAVORITES, ENQUIRECATEGORIES, ENQUIREFAVORITES, ENQUIREWORDS } from './studyType';

function enquireCategories(data) {
  const request = axios.get('/api/categories').then((response) => response.data)
  .catch((err) => err)
  return {
    type: ENQUIRECATEGORIES,
    payload: request,
  };
}

function enquireWords(data) {
  const request = axios.get(`/api/words/category/${data}`).then((response) => response.data)
  .catch((err) => err)
  return {
    type: ENQUIREWORDS,
    payload: request,
  };
}

function allWords(data) {
  const request = axios.get('/api/words').then((response) => response.data)
  .catch((err) => err)
  return {
    type: ALLWORDS,
    payload: request,
  };
}

function enquireFavorites(data) {
  const request = axios.get(`/api/favorites/user/${data}`).then((response) => response.data)
  .catch((err) => err)
  return {
    type: ENQUIREFAVORITES,
    payload: request,
  };
}

function checkFavorites(data) {
  const request = axios.get(`/api/favorites/user/${data.userId}/${data.wordId}`).then((response) => response.data)
  .catch((err) => err)
  return {
    type: CHECKFAVORITES,
    payload: request,
  };
}

function addFavorites(data) {
  const request = axios.post(`/api/favorites`).then((response) => response.data)
  .catch((err) => err)
  return {
    type: ADDFAVORITES,
    payload: request,
  };
}

function deleteFavorites(data) {
  const request = axios.delete(`/api/favorites`).then((response) => response.data)
  .catch((err) => err)
  return {
    type: DELETEFAVORITES,
    payload: request,
  };
}


const studyAction = { 
  enquireCategories,
  enquireWords,
  allWords,
  enquireFavorites,
  checkFavorites,
  addFavorites,
  deleteFavorites,
}

export default studyAction;