import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchBox: document.querySelector('input#search-box'),
    list: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(evt) {

    const inputValue = evt.target.value.trim();

    if(inputValue.length === 0) {
        return clearList();
    }

    fetchCountries(inputValue).then(countries => {

        if(countries.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name.');
        } 
        else if (countries.length >= 2 && countries.length <= 10) {
    
            const listMarkup = countries.reduce((markup, country) => 
            createListMarkup(country) + markup,
            '');
            
            return updateCountryList(listMarkup);
        } 
        else if(countries.length === 1) {
            const markup = createMarkupInfo(countries[0]);
            return updateCountryInfo(markup);
        } 
        else {
            throw new Error('No data');
        }
    })
    .catch(onError);
}
    
function createListMarkup({name: {official}, flags: {svg}}) {
    return `
    <li class="item wrap">
        <img src="${svg}" alt="${official}" class ="list-img" width="25px" height="25px"> 
        <h1 class="list-name">${official}</h1>
    </li>`
};

function updateCountryList(markup) {
    refs.list.innerHTML = markup;

    if(refs.list) {
        refs.countryInfo.innerHTML = '';
    }
};

function createMarkupInfo({name: {official}, capital, population, languages, flags: {svg}}) {
    return `
        <div class="title-wrap wrap">
            <img src="${svg}" alt="${official}" class="list-img" width="25px" height="25px">
            <h1 class="info-title">${official}</h1>
        </div>
        <div class="text-wrap">
        <p><b>Capital: </b>${capital}</p>
        <p><b>Population: </b>${population}</p>
        <p><b>Languages: </b>${Object.values(languages).join(', ')}</p>
        </div>`
        
};

function updateCountryInfo(markup){
    refs.countryInfo.innerHTML = markup;
    refs.list.innerHTML = '';
}

function onError(err) {
    console.log(err);
    Notify.failure('Oops, there is no country with that name');
    refs.list.innerHTML = '';
}

function clearList() {
    refs.list.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}