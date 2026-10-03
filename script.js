const movieForm = document.querySelector("#movieForm");
const movieInput = document.querySelector("#movieInput");
const movieHub = document.querySelector("#movieHub");
const navToggle = document.querySelector("#navToggle");
const navMenu = document.querySelector("#navMenu");

// --- Mobile Navigation Toggle ---
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("active");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  // Close mobile nav when clicking any link
  navMenu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// --- Search & Contact Smooth Navigation ---
function focusSearchInput() {
  const searchSection = document.getElementById("search");
  if (searchSection) {
    searchSection.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      if (movieInput) {
        movieInput.focus();
      }
    }, 450);
  }
}

// Handle Search links on page
document.querySelectorAll('a[href="#search"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    focusSearchInput();
  });
});

// Handle Contact links on page
document.querySelectorAll('a[href="#contact"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Handle initial hash in URL (e.g. index.html#search or index.html#contact)
window.addEventListener("DOMContentLoaded", () => {
  if (window.location.hash === "#search") {
    setTimeout(focusSearchInput, 200);
  } else if (window.location.hash === "#contact") {
    setTimeout(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  }
});

// --- Movie Search Logic (Preserved) ---
movieForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let query = movieInput.value.trim();
  if (!query) {
    return;
  }
  console.log(query);
  searchMovies(query);
});

// Helper for quick-search suggestion tags
function quickSearch(title) {
  if (movieInput) {
    movieInput.value = title;
    searchMovies(title);
  }
}

async function searchMovies(movieName) {
  movieHub.innerHTML = `<div class="loader"></div>`;

  try {
    let response = await fetch(
      `https://www.omdbapi.com/?apikey=62bad6fa&s=${encodeURIComponent(movieName)}`
    );
    let data = await response.json();
    console.log(data);

    if (data.Response === "True") {
      displayMovie(data.Search);
    } else {
      console.log(data.Error);
      movieHub.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h3 class="empty-title">No movies found</h3>
          <p class="empty-subtitle">Try searching with a different movie title.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Search fetch error:", error);
    movieHub.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 class="empty-title">Search Error</h3>
        <p class="empty-subtitle">Something went wrong while fetching movies. Please try again.</p>
      </div>
    `;
  }
}

function displayMovie(data) {
  movieHub.innerHTML = "";

  data.forEach((movie) => {
    const div = document.createElement("div");

    div.dataset.imdbID = movie.imdbID;
    div.setAttribute("class", "movie-card");

    const hasPoster = movie.Poster && movie.Poster !== "N/A";

    div.innerHTML = `
      <div class="card-poster">
        ${hasPoster 
          ? `<img src="${movie.Poster}" alt="${movie.Title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'poster-fallback\\'><svg fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\' viewBox=\\'0 0 24 24\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' d=\\'m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z\\'/></svg><span>No Poster</span></div>';">` 
          : `<div class="poster-fallback">
              <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
              </svg>
              <span>No Poster</span>
            </div>`
        }
      </div>
      <div class="card-info">
        <p class="card-title">${movie.Title}</p>
        <p class="card-year">${movie.Year}</p>
      </div>
    `;
    movieHub.append(div);
  });
}

movieHub.addEventListener("click", (e) => {
  e.stopPropagation();
  const movieCard = e.target.closest(".movie-card");
  if (!movieCard) return;

  const imdbID = movieCard.dataset.imdbID;
  if (imdbID) {
    location.href = `movie-detail.html?id=${imdbID}`;
    console.log(imdbID);
  }
});