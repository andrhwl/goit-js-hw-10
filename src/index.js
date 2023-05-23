// ? // Імпорти ;
import './css/styles.css';
import fetchCountries from './fetch-api.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
// ? // Посилання ;
const inputFormUrl = document.querySelector('input#search-box');
const countryListUrl = document.querySelector('.country-list');
const countryInfoUrl = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
// ? // Слухач інпуту з дебоунсом функції ;
inputFormUrl.addEventListener('input', debounce(onFormInput, DEBOUNCE_DELAY));

function onFormInput(event) {
  // ? // Якщо інпут очищено - контент зникає ;
  if (event.target.value.trim() === '') {
    countryListUrl.innerHTML = '';
    countryInfoUrl.innerHTML = '';
    return;
  }
  // ? // Виклик імпортованої функції з доданим ланцюгом then та catch;
  fetchCountries(event.target.value.trim())
    .then(data => {
      if (data.length > 10) {
        tooManyMatchesFound();
      } else if (data.length === 1) {
        renderCountryCard(data);
      } else if (data.length >= 2 && data.length <= 10) {
        renderCountryList(data);
      }
    })
    .catch(error => {
      if (error.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name!');
      } else {
        Notiflix.Notify.failure(error.message)
      }
    });
}
// ? // Функція яка повідомляє про завелику кількість співпадінь ;
function tooManyMatchesFound() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
// ? // Функція рендеру карточки однієї знайденої країни
function renderCountryCard(data) {
  countryListUrl.innerHTML = '';
  countryInfoUrl.innerHTML = data
    .map(({ capital, flags, languages, name, population }) => {
      return `<img src="${flags.svg}" width="110" alt="${flags.alt}">
  <h2>${name.common}, (${name.official})</h2>
  <p>Capital: ${capital}</p>
  <p>Languages: ${Object.values(languages).join(', ')}</p>
  <p>Population: ${population}</p>`;
    })
    .join('');
}
// ? // Функція рендеру списку знайдених країн ;
function renderCountryList(data) {
  countryInfoUrl.innerHTML = '';
  countryListUrl.innerHTML = data
    .map(({ flags, name }) => {
      return `<li class="list-item">
    <img src="${flags.svg}" width="80" alt="${flags.alt}">
    <h2>${name.common}, (${name.official})</h2>
  </li>`;
    })
    .join('');
}
