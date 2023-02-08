
const END_POINT = 'https://restcountries.com/v3.1';
const SPESIFIED_FIELDS = 'name,capital,population,flags,languages';

function fetchCountries(name) {
    return fetch(`${END_POINT}/name/${name}?fields=${SPESIFIED_FIELDS}`)
    .then(resp => resp.json());
}

export { fetchCountries };