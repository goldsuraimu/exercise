const BASE_URL = 'https://webdev.alphacamp.io';
const INDEX_URL = BASE_URL + '/api//movies/';
const POSTER_URL = BASE_URL + '/posters/';

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

const dataPanel = document.querySelector('#movie-panel');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');



                    // function

function renderMovieList (data) {
    let rawHTML = ``;
    data.forEach((item) => {
        rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${POSTER_URL + item.image}" class="card-img-top" alt="movie poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <button type="submit" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">more</button>
              <button type="submit" class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>`
    })
    dataPanel.innerHTML = rawHTML;
}


function showMovieModal(id) {
    const movieModalTitle = document.querySelector('#movie-modal-title');
    const moviieModalImg = document.querySelector('#movie-modal-img');
    const movieModalDate = document.querySelector('#movie-modal-date');
    const movieModalDesription = document.querySelector('#movie-modal-description');

    axios.get(INDEX_URL + id)
    .then((response) => {
        data = response.data.results;
        console.log(data)
        movieModalTitle.innerText = data.title;
        movieModalDate.innerText = 'Release date: ' + data.release_date;
        movieModalDesription.innerText = data.description;
        moviieModalImg.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie poster" class="img-fluid">`;
    })
    .catch( err => console.log(err))
}

function removeFromFavorite (id) {
  if(!movies || !movies.length) return;

  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if(movieIndex === -1) return;

  movies.splice(movieIndex,1);
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}


                  // addEventListener

dataPanel.addEventListener('click', function onDataPanelClick(event) {
    if (event.target.matches('.btn-show-movie')) {
        showMovieModal(Number(event.target.dataset.id));
    } else if (event.target.matches('.btn-remove-favorite')) {
      removeFromFavorite(Number(event.target.dataset.id));
    }
})

searchForm.addEventListener('submit', function onSearchFormSumbmitted(event) {
  const keyWords = searchInput.value.trim().toLowerCase();

  let filteredMovies =[];

  event.preventDefault();

  if(!keyWords.length){
    return alert('Please enter vaild string!');
  }
  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyWords));
  if(filteredMovies.length === 0) {
    return alert(`your keywords: ${keyWords} no result`);
  }
  renderMovieList(filteredMovies);
})

renderMovieList(movies);

console.log(movies);