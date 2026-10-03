const movieDetail = document.querySelector("#movie-detail");
const params = new URLSearchParams(location.search);
const imdbID = params.get("id");
const navToggle = document.querySelector("#navToggle");
const navMenu = document.querySelector("#navMenu");

// --- Mobile Navigation Toggle ---
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("active");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  navMenu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// --- Fetch Movie Details ---
if (imdbID) {
  searchMovie(imdbID.trim());
} else {
  movieDetail.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 class="empty-title">No Movie Selected</h3>
      <p class="empty-subtitle">Please return to the search page and select a movie.</p>
      <div style="margin-top: 1.5rem;">
        <a href="index.html" class="search-btn action-btn">Search Movies</a>
      </div>
    </div>
  `;
}

async function searchMovie(imdbID) {
  movieDetail.innerHTML = `<div class="loader"></div>`;

  try {
    let response = await fetch(
      `https://www.omdbapi.com/?apikey=62bad6fa&i=${encodeURIComponent(imdbID)}&plot=full`
    );
    let data = await response.json();
    console.log(data);

    if (data.Response === "True") {
      displayMovie(data);
    } else {
      console.log(data.Error);
      movieDetail.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h3 class="empty-title">Movie Not Found</h3>
          <p class="empty-subtitle">${data.Error || "Could not retrieve details for this movie."}</p>
          <div style="margin-top: 1.5rem;">
            <a href="index.html" class="search-btn action-btn">Back to Search</a>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error("Detail fetch error:", error);
    movieDetail.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 class="empty-title">Connection Error</h3>
        <p class="empty-subtitle">Failed to load movie details. Please check your internet connection.</p>
        <div style="margin-top: 1.5rem;">
          <a href="index.html" class="search-btn action-btn">Back to Search</a>
        </div>
      </div>
    `;
  }
}

// Cohesive cinematic composition adapting to poster dimensions
function displayMovie(data) {
  const hasPoster = data.Poster && data.Poster !== "N/A";
  const rating = data.imdbRating || data.imdbrating;
  const hasRating = rating && rating !== "N/A";

  movieDetail.innerHTML = `
    <div class="detail-card">
      <!-- Left Column: Movie Poster -->
      <div class="detail-poster-wrapper">
        ${hasPoster 
          ? `<img src="${data.Poster}" alt="${data.Title}" class="detail-poster" onerror="this.parentElement.innerHTML='<div class=\\'poster-fallback\\'><svg fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\' viewBox=\\'0 0 24 24\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' d=\\'m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z\\'/></svg><span>No Poster</span></div>';">`
          : `<div class="poster-fallback">
              <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
              </svg>
              <span>No Poster Available</span>
            </div>`
        }
      </div>

      <!-- Right Column: Movie Information (naturally matches poster height) -->
      <div class="detail-content">
        <!-- Title & Metadata Header -->
        <div class="detail-header-group">
          <h1 class="detail-title">${data.Title}</h1>

          <div class="detail-meta-row">
            ${data.Year && data.Year !== 'N/A' ? `<span class="meta-item">${data.Year}</span>` : ''}
            ${data.Rated && data.Rated !== 'N/A' ? `<span class="meta-badge">${data.Rated}</span>` : ''}
            ${data.Runtime && data.Runtime !== 'N/A' ? `<span class="meta-item">${data.Runtime}</span>` : ''}
            ${data.Genre && data.Genre !== 'N/A' ? `<span class="meta-genre">${data.Genre}</span>` : ''}
            ${hasRating ? `
              <div class="detail-rating-pill">
                <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span class="rating-value">${rating}</span>
                <span class="rating-scale">/10</span>
                ${data.imdbVotes && data.imdbVotes !== 'N/A' ? `<span class="rating-votes">(${data.imdbVotes})</span>` : ''}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Plot Overview -->
        <div class="detail-plot">
          <h2 class="section-heading">Plot Overview</h2>
          <p class="plot-text">${data.Plot && data.Plot !== 'N/A' ? data.Plot : 'No plot overview available for this movie.'}</p>
        </div>

        <!-- Details List -->
        <div class="detail-grid">
          ${data.Director && data.Director !== 'N/A' ? `
            <div class="info-row">
              <span class="info-label">Director</span>
              <span class="info-value">${data.Director}</span>
            </div>
          ` : ''}

          ${data.Writer && data.Writer !== 'N/A' ? `
            <div class="info-row">
              <span class="info-label">Writer</span>
              <span class="info-value">${data.Writer}</span>
            </div>
          ` : ''}

          ${data.Actors && data.Actors !== 'N/A' ? `
            <div class="info-row">
              <span class="info-label">Cast</span>
              <span class="info-value">${data.Actors}</span>
            </div>
          ` : ''}

          ${data.Released && data.Released !== 'N/A' ? `
            <div class="info-row">
              <span class="info-label">Released</span>
              <span class="info-value">${data.Released}</span>
            </div>
          ` : ''}

          ${(data.Language && data.Language !== 'N/A') || (data.Country && data.Country !== 'N/A') ? `
            <div class="info-row">
              <span class="info-label">Origin</span>
              <span class="info-value">${[data.Language !== 'N/A' ? data.Language : '', data.Country !== 'N/A' ? data.Country : ''].filter(Boolean).join(' • ')}</span>
            </div>
          ` : ''}
        </div>

        <!-- Actions (Aligned at bottom of poster) -->
        <div class="detail-actions">
          ${data.imdbID ? `
            <a href="https://www.imdb.com/title/${data.imdbID}" target="_blank" rel="noopener noreferrer" class="imdb-btn">
              <span>View on IMDb</span>
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          ` : ''}
          <a href="index.html" class="detail-back-btn">
            <span>← Back to Search</span>
          </a>
        </div>
      </div>
    </div>
  `;
}