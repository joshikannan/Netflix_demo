/*
🌟 APP: Make Netflix

Create a fetchMovies() function that will make a dynamic API call to what you need 👇
========================================

- fetchMovies()

** fetchMovies takes in an URL, a div id or class from the HTML, and a path (poster or backdrop)



These are the 3 main functions you must create 👇
========================================

- getOriginals()

- getTrendingNow()

- getTopRated()


** These functions will provide the URL you need to fetch movies of that genere **

These are all the DIV ID's you're gonna need access to 👇
========================================================
#1 CLASS 👉 'original__movies' = Div that holds Netflix Originals
#2 ID 👉 'trending' = Div that holds trending Movies
#3 ID 👉 'top_rated' = Div that holds top rated Movies
*/

// Call the main functions the page is loaded

window.onload = () => {
  getOriginals();
  getTrendingNow();
  getTopRated();
  //when window loadds this three fn runs.
};

// ** Helper function that makes dynamic API calls **
// path_type 👉 (backdrop, poster)
// dom_element 👉 (trending, top rated)
// fetchMovies('https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1', 'top_rated', 'backdrop_path')

function fetchMovies(url, dom_element, path_type) {
  fetch(url) //promise
    .then((response) => {
      //.then hangling what want todo after promise is resolved
      if (response.ok) {
        return response.json(); //.json() => promise
      } else {
        throw new Error("something went wrong");
      }
    })
    .then((data) => {
      // handling the data return  from response
      //on api call we get array of objects as return data
      // console.log(data) //  =>  see what all are the data holds
      showMovies(data, dom_element, path_type); //we pass data as args, which have arrays of objects, 20 element data
      //in   showMovies() => it fetch the arrays from .results
    })
    .catch((error_data) => {
      console.log(error_data);
    });
}

//  ** Function that displays the movies to the DOM **
showMovies = (movies, dom_element, path_type) => {
  //parameter movies, hold the return data, in which key-> result have arrays of objects

  // Create a variable that grabs id or class
  //document.getElementById() -> access only  id
  //document.getElementsByClassName() -> access only  class
  //document.querySelector() ->  returns the first element that matches a CSS selector.
  //if 4 element of same class it fetch 1st instance of class
  //if 4 element of same id it fetch 1st instance of id
  // To return all matches (not only the first), use the querySelectorAll() instead.

  var moviesEl = document.querySelector(dom_element); //dom_element as args for to make dynamic
  // Loop through object
  for (var movie of movies.results) {
    //movies.results => arrays of objects
    //console.log(movies.results) // see what data it holds
    //movie -> variable, fetching each  element in array of on=bject
    //object -> movies
    //results holds the array, so to acces the array -> movies.results

    //for every movie in movies.result, create a img tag, set attribue, put thr source in,
    // and addit to the div until all element (20) in object is donr

    // Within loop create an img element
    var imageElement = document.createElement("img");

    // Set attribute
    imageElement.setAttribute("data-id", movie.id); //movie.id -> acess the id of element in  results array.

    // Set source
    imageElement.src = `https://image.tmdb.org/t/p/original${movie[path_type]}`;

    // Add event listener to handleMovieSelection() onClick
    imageElement.addEventListener("click", (e) => {
      handleMovieSelection(e);
    });
    // Append the imageElement to the dom_element selected
    moviesEl.appendChild(imageElement);
  }
};

// ** Function that fetches Netflix Originals **
function getOriginals() {
  var url =
    "https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213";
  fetchMovies(url, ".original__movies", "poster_path");
}
// ** Function that fetches Trending Movies **
function getTrendingNow() {
  var url =
    "https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045";
  fetchMovies(url, "#trending", "backdrop_path");
}
// ** Function that fetches Top Rated Movies **
function getTopRated() {
  var url =
    "https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1";
  fetchMovies(url, "#top_rated", "backdrop_path");
}

// ** BONUS **

async function getMovieTrailer(id) {
  var url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`;
  return await fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("something went wrong");
    }
  });
}

const setTrailer = (trailers) => {
  const iframe = document.getElementById("movieTrailer");
  const movieNotFound = document.querySelector(".movieNotFound");
  if (trailers.length > 0) {
    movieNotFound.classList.add("d-none");
    iframe.classList.remove("d-none");
    iframe.src = `https://www.youtube.com/embed/${trailers[0].key}`;
  } else {
    iframe.classList.add("d-none");
    movieNotFound.classList.remove("d-none");
  }
};

const handleMovieSelection = (e) => {
  const id = e.target.getAttribute("data-id");
  const iframe = document.getElementById("movieTrailer");
  // here we need the id of the movie
  getMovieTrailer(id).then((data) => {
    const results = data.results;
    const youtubeTrailers = results.filter((result) => {
      if (result.site == "YouTube" && result.type == "Trailer") {
        return true;
      } else {
        return false;
      }
    });
    setTrailer(youtubeTrailers);
  });

  // open modal
  $("#trailerModal").modal("show");
  // we need to call the api with the ID
};
