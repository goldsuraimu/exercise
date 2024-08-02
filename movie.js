const BASE_URL = 'https://webdev.alphacamp.io';
const INDEX_URL = BASE_URL + '/api//movies/';
const POSTER_URL = BASE_URL + '/posters/';
const MOVIES_PER_PAGE = 12;

const movies = [];
let filteredMovies = [];


const dataPanel = document.querySelector('#movie-panel');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const paginator = document.querySelector('#paginator');



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
              <button type="submit" class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
    })
    dataPanel.innerHTML = rawHTML;
}

function renderPaginator(amount){
  const numberOFPages = Math.ceil(amount / MOVIES_PER_PAGE);
  let rawHTML =``;

  for (let page = 1; page <= numberOFPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies;
  const startIndex = (page - 1) * MOVIES_PER_PAGE;

  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);

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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
  const movie = movies.find((movie) => movie.id === id)

  if(list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！');
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}





                  // addEventListener

dataPanel.addEventListener('click', function onDataPanelClick(event) {
    if (event.target.matches('.btn-show-movie')) {
        showMovieModal(Number(event.target.dataset.id));
    } else if (event.target.matches('.btn-add-favorite')) {
      addToFavorite(Number(event.target.dataset.id));
    }
})

searchForm.addEventListener('submit', function onSearchFormSumbmitted(event) {
  const keyWords = searchInput.value.trim().toLowerCase();

  event.preventDefault();

  if(!keyWords.length){
    return alert('Please enter vaild string!');
  }
  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyWords));
  if(filteredMovies.length === 0) {
    return alert(`your keywords: ${keyWords} no result`);
  }
  renderMovieList(getMoviesByPage(1));
  renderPaginator(filteredMovies.length);
})

paginator.addEventListener("click", function onPaginatorClicked(e) {
  if(e.target.tagName !== 'A') return;

  const page = e.target.dataset.page;

  renderMovieList(getMoviesByPage(page));
  console.log(Number(e.target.dataset.page))
})




axios.get(INDEX_URL).then((response) => {
    movies.push(...response.data.results);
    renderMovieList(getMoviesByPage(1));
    renderPaginator(movies.length);
})
.catch((error) => {
  
    console.log(error);
})
