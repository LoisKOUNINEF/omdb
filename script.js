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
let dataFetched = [];
let displayError = document.getElementById("errorfield");
// condition to prevent bugs in search loop
let a = 0;

submitButton.addEventListener('click', e => {
  searchCounter = 1;
  target.innerHTML = '';
  let userSearch = searchBar.value;
  getData(userSearch);
});

window.addEventListener('keyup', e => {
  if (e.code === 'Enter') {
    searchCounter = 1;
    target.innerHTML = '';
    let userSearch = searchBar.value;
    getData(userSearch);
  }
});

const getData = async (userSearch) => {
  displayError.textContent = "";
  let dataToDisplay = [];
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${omdbKey}&s=${userSearch}&page=${searchCounter}`);
    const matchingData = await response.json();
    matchingData.Search.forEach(movie => {
      dataToDisplay.push({ 'name': movie.Title, 'date': movie.Year, 'poster': movie.Poster, id: movie.imdbID });
      dataFetched.push({ 'name': movie.Title, 'date': movie.Year, 'poster': movie.Poster, id: movie.imdbID})
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
      <div class="movie observer">
      <div class="movie-left">
      <img class='icon' src="${e.poster}" onerror="this.src='https://images.unsplash.com/photo-1560109947-543149eceb16?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNpbmVtYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'" alt="movie poster" />
      </div>
      <div class="movie-right">
      <div class="right-up">
      <div class="movie-el"><strong>${e.name}</strong></div>
      <div class="movie-el">${e.date}</div>
      </div>
      <br><br><br><br><br><br><br><br><br>
      <button type=button class="read-more-btn">Read more</button>
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

  elementsToObserve = document.querySelectorAll(".observer");
  elementsToObserve.forEach( function (e) {
    e.classList.add('hidden');
    observer.observe(e);
  });

  let readMoreBtn = document.querySelectorAll(".read-more-btn");
  btnArray = Array.from(readMoreBtn);
  readMoreBtn.forEach(button => {
    button.addEventListener('click', e => {
      let btnIndex = btnArray.indexOf(e.target);
      getDescription(dataFetched[btnIndex].id);
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

  let readMoreImg = document.querySelectorAll(".icon");
  imgArray = Array.from(readMoreBtn);
  readMoreImg.forEach(button => {
    button.addEventListener('click', e => {
      let imgIndex = imgArray.indexOf(e.target);
      getDescription(dataFetched[imgIndex].id);
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
    const moreDescription = await description.json();
    modalTitle.innerHTML = `<strong>${moreDescription.Title}</strong> (${moreDescription.Year})`;
    modalRated.innerHTML = `Rated: ${moreDescription.Rated}`;
    modalRuntime.innerHTML = `Runtime: ${moreDescription.Runtime}`;
    modalDirector.innerHTML = `Director: ${moreDescription.Director}`;
    modalGenre.innerHTML = `Genre: ${moreDescription.Genre}`;
    modalPlot.innerHTML = `Synopsis: ${moreDescription.Plot}`;
    modalPartLeft.innerHTML = `<img class="poster" src="${moreDescription.Poster}" onerror="this.src='https://images.unsplash.com/photo-1560109947-543149eceb16?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNpbmVtYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'" alt="movie poster" />`;
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
