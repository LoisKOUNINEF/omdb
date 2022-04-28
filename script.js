let body = document.querySelector("body");
let modalBg = document.querySelector(".modal-bg");
let modalTitle = document.querySelector(".title-year");
let modalRated = document.querySelector(".rated");
let modalRuntime= document.querySelector(".runtime");
let modalDirector = document.querySelector(".director");
let modalGenre = document.querySelector(".genre");
let modalPlot = document.querySelector(".plot");
let modalPartLeft= document.querySelector(".modal-part-left");

let target = document.getElementById("end");
let searchBar = document.getElementById('search-bar');
let submitButton = document.getElementById('submit-btn');
let searchCounter = 1;
let dataToDisplay = [];
let displayError = document.getElementById("errorfield");

// condition to prevent bugs in search loop
let a = 0;

submitButton.addEventListener('click', e => {
  target.innerHTML = '';
  let userSearch = searchBar.value;
  getData(userSearch);
});

const getData = async (userSearch) => {
  displayError.textContent = "";
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${omdbKey}&s=${userSearch}&page=${searchCounter}`);
    const matchingData = await response.json();
    matchingData.Search.forEach(movie => {
      dataToDisplay.push({ 'name': movie.Title, 'date': movie.Year, 'poster': movie.Poster, id: movie.imdbID });
    });
    displayData(dataToDisplay);
  }
  catch (error) {
    console.error('Response error:', error.message);
    displayError.textContent = "Please make a more precise request."
  }
}

const displayData = (input) => {
  input.forEach(e => {
    target.insertAdjacentHTML("beforeend", `
      <div class="movie intObs">
      <div class=movie-left>
      <img class='icon' src="${e.poster}" alt="movie icon" />
      </div>
      <div class="movie-right">
      <div class="right-up">
      <div class="listEl"><strong>${e.name}</strong></div>
      <div class="listEl">${e.date}</div>
      </div>
      <button type=button class="read-more-btn" >Read more</button>
      </div>
      </div>
      `)
  });

  a = 0;

  let observer = new IntersectionObserver(function (observables) {
    observables.forEach(function (observable, id) {
      if (observable.intersectionRatio > 0.35) {
        observable.target.classList.remove('hidden');
      }
    })
  }, {
    threshold: [0.35]
  });

  elementsToObserve = document.querySelectorAll(".intObs");
  elementsToObserve.forEach( function (e) {
    e.classList.add('hidden');
    observer.observe(e);
  });

  let readMoreBtn = document.querySelectorAll(".read-more-btn");
  readMoreBtn.forEach(button => {
    button.addEventListener('click', e => {
      let btnIndex = Array.from(readMoreBtn).indexOf(e.target);
      getDescription(dataToDisplay[btnIndex].id);
      modalBg.classList.add("visible");
      body.classList.add("modal-activated");

      modalBg.addEventListener('click', () => {
        modalBg.classList.remove("visible");
        body.classList.remove("modal-activated");
        modalTitle.innerHTML = '';
        modalRated.innerHTML = '';
        modalRuntime.innerHTML = '';
        modalDirector.innerHTML = '';
        modalGenre.innerHTML = '';
        modalPlot.innerHTML = '';
        modalPartLeft.innerHTML = '';
      });
    })
  });
}

const getDescription = async (movieId) => {
  try {
    const description = await fetch(`http://www.omdbapi.com/?apikey=${omdbKey}&i=${movieId}&plot=full`);
    const curatedDescription = await description.json();
    modalTitle.innerHTML = `<strong>${curatedDescription.Title}</strong> (${curatedDescription.Year})`;
    modalRated.innerHTML = `Rated: ${curatedDescription.Rated}`;
    modalRuntime.innerHTML = `Runtime: ${curatedDescription.Runtime}`;
    modalDirector.innerHTML = `Director: ${curatedDescription.Director}`;
    modalGenre.innerHTML = `Genre: ${curatedDescription.Genre}`;
    modalPlot.innerHTML = `Synopsis: ${curatedDescription.Plot}`;
    modalPartLeft.innerHTML = `<img class="poster" src="${curatedDescription.Poster}" alt="movie poster" />`;
  }
  catch (error) {
    console.error('Response error:', error.message);
  }
}

window.onscroll = function() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    let userSearch = searchBar.value;
    if (a === 0) {
      a = 1;
      searchCounter++;
      getData(userSearch);
    }
  }
}
