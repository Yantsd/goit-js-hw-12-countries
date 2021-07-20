'use strict';
import countrySearch from './fetchCountries';
import refs from './refs'
import articlesOneCountry from '../templates/templatesOneCountry.hbs';
import countryList from '../templates/templatesManyCoutry.hbs'

import '@pnotify/core/dist/BrightTheme.css';
const { error } = require('@pnotify/core');
var debounce = require('lodash.debounce');


refs.searchForm.addEventListener('input', debounce(countrySearchInputHandler, 500));

function countrySearchInputHandler(event) {
  event.preventDefault();
  clearArticlesContainer();
   const searchQuery = event.target.value;
  
  
  countrySearch.fetchCountries(searchQuery).then(data => {
    
      if (data.length > 10) {
          error({
              text: "Too many matches found. Please enter a more specific query!"
          });
      } else if (data.status === 404) {
        error({
          text: "No country has been found. Please enter a more specific query!"
      });
      } else if (data.length === 1) {
          buildListMarkup(data, articlesOneCountry);
      } else if (data.length <= 10) {
          buildListMarkup(data, countryList);
      }
  })
  .catch(Error => {
      Error({
          text: "You must enter query parameters!"
      });
      console.log(Error)
  })
}

function buildListMarkup(countryes, template) {
  const markup = countryes.map(count => template(count)).join();
  refs.articlesContainer.insertAdjacentHTML('afterbegin', markup)
}

function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
}