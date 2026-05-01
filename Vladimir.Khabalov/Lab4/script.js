// Movie Class
class Movie {
    constructor(title, director, actors = []) {
        this.title = title;
        this.director = director;
        this.actors = actors;
    }

    addActor(name) {
        if (!this.actors.includes(name)) {
            this.actors.push(name);
            return true;
        }
        return false;
    }

    removeActor(name) {
        const index = this.actors.indexOf(name);
        if (index !== -1) {
            this.actors.splice(index, 1);
            return true;
        }
        return false;
    }

    get castSize() {
        return this.actors.length;
    }
}

// Global state
let movies = [];


// Простое уведомление
function showMessage(msg, isError = true) {
    alert(msg);
}

// Проверка дубликатов
function isMovieDuplicate(title, director) {
    return movies.some(movie => 
        movie.title.toLowerCase() === title.toLowerCase() && 
        movie.director.toLowerCase() === director.toLowerCase()
    );
}

function isActorDuplicateInMovie(movieIndex, actorName) {
    if (!movies[movieIndex]) return false;
    return movies[movieIndex].actors.some(actor => 
        actor.toLowerCase() === actorName.toLowerCase()
    );
}


// Load from localStorage
function loadFromStorage() {
    const stored = localStorage.getItem('movies');
    if (stored) {
        const parsed = JSON.parse(stored);
        movies = parsed.map(m => new Movie(m.title, m.director, m.actors));
    } else {
        // Sample data
        movies = [
            new Movie("Inception", "Christopher Nolan", ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"]),
            new Movie("The Matrix", "Lana Wachowski", ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"]),
            new Movie("Pulp Fiction", "Quentin Tarantino", ["John Travolta", "Samuel L. Jackson", "Uma Thurman"])
        ];
        saveToStorage();
    }
   
}

function saveToStorage() {
    localStorage.setItem('movies', JSON.stringify(movies.map(m => ({
        title: m.title,
        director: m.director,
        actors: m.actors
    }))));
}

// Async operations with Promise + setTimeout
 function asyncOperation(operation, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(operation(data));
        }, 500);
    });
}

// CRUD Operations
function addMovieAsync(movie) {
    if (isMovieDuplicate(movie.title, movie.director)) {
        showMessage(`Фильм "${movie.title}" уже существует!`);
        return false;
    }
    return asyncOperation(() => {
        movies.push(movie);
        saveToStorage();
        renderUI();
        return movie;
    }, movie);
}

function deleteMovieAsync(index) {
    return asyncOperation(() => {
        movies.splice(index, 1);
        saveToStorage();
        renderUI();
        return true;
    }, index);
}

function addActorToMovieAsync(movieIndex, actorName) {
    if (isActorDuplicateInMovie(movieIndex, actorName)) {
        showMessage(`Актер "${actorName}" уже есть в этом фильме!`);
        return false;
    }
    return asyncOperation(() => {
        const result = movies[movieIndex].addActor(actorName);
        if (result) {
            saveToStorage();
            renderUI();
        }
        return result;
    }, { movieIndex, actorName });
}

function removeActorFromMovieAsync(movieIndex, actorName) {
    return asyncOperation(() => {
        const result = movies[movieIndex].removeActor(actorName);
        if (result) {
            saveToStorage();
            renderUI();
        }
        return result;
    }, { movieIndex, actorName });
}

// Utility Functions (4.2)
function groupByDirector() {
    const grouped = {};
    movies.forEach(movie => {
        if (!grouped[movie.director]) {
            grouped[movie.director] = [];
        }
        grouped[movie.director].push(movie);
    });
    return grouped;
}

function getUniqueActors() {
    const actors = new Set();
    movies.forEach(movie => {
        movie.actors.forEach(actor => actors.add(actor));
    });
    return Array.from(actors);
}

function groupByCastSize() {
    const grouped = {};
    movies.forEach(movie => {
        const size = movie.castSize;
        if (!grouped[size]) {
            grouped[size] = [];
        }
        grouped[size].push(movie);
    });
    return grouped;
}

function getMoviesByActor(actorName) {
    return movies.filter(movie => movie.actors.includes(actorName));
}

function getAllTitles() {
    return movies.map(movie => movie.title);
}

// Render Functions
function renderStats() {
    const statsBar = document.getElementById('statsBar');
    const uniqueActors = getUniqueActors();
    const groupedByDirector = groupByDirector();
    const groupedByCastSize = groupByCastSize();
    
    if (statsBar) {
        statsBar.innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${movies.length}</div>
                <div class="stat-label">Всего фильмов</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${uniqueActors.length}</div>
                <div class="stat-label">Уникальных актеров</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${Object.keys(groupedByDirector).length}</div>
                <div class="stat-label">Режиссеров</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${Object.keys(groupedByCastSize).length}</div>
                <div class="stat-label">Групп по кол-ву актеров</div>
            </div>
        `;
    }
}

function renderMovies() {
    const container = document.getElementById('moviesContainer');
    
    if (!container) return;
    
    if (movies.length === 0) {
        container.innerHTML = '<div class="loading">Нет фильмов. Добавьте первый фильм!</div>';
        return;
    }
    
    container.innerHTML = movies.map((movie, index) => `
        <div class="movie-card">
            <div class="movie-title">${escapeHtml(movie.title)}</div>
            <div class="movie-director">🎬 Режиссер: ${escapeHtml(movie.director)}</div>
            <div class="actors-list">
                <div class="actors-title">⭐ Актёры (${movie.castSize}):</div>
                ${movie.actors.map(actor => `<span class="actor-tag">${escapeHtml(actor)}</span>`).join('')}
                ${movie.actors.length === 0 ? '<span style="color: #999; font-size: 12px;">Нет актеров</span>' : ''}
            </div>
            <div class="cast-size">👥 Количество актеров: ${movie.castSize}</div>
        </div>
    `).join('');
}

function renderUI() {
    renderStats();
    renderMovies();
}

// Modal Functions
function showAddMovieModal() {
    const modal = document.getElementById('addMovieModal');
    if (modal) {
        modal.style.display = 'flex';
        // Очищаем форму
        document.getElementById('addMovieForm').reset();
    }
}

function showDeleteMovieModal() {
    const select = document.getElementById('deleteMovieSelect');
    if (select && movies.length > 0) {
        select.innerHTML = movies.map((movie, index) => 
            `<option value="${index}">${escapeHtml(movie.title)} (${escapeHtml(movie.director)})</option>`
        ).join('');
    } else if (select) {
        select.innerHTML = '<option disabled>Нет фильмов для удаления</option>';
    }
    const modal = document.getElementById('deleteMovieModal');
    if (modal) modal.style.display = 'flex';
}

function showAddActorModal() {
    const select = document.getElementById('addActorMovieSelect');
    if (select) {
        if (movies.length > 0) {
            select.innerHTML = movies.map((movie, index) => 
                `<option value="${index}">${escapeHtml(movie.title)} (${escapeHtml(movie.director)})</option>`
            ).join('');
        } else {
            select.innerHTML = '<option disabled>Нет фильмов для добавления актеров</option>';
        }
    }
    
    // Очищаем поле ввода имени актера
    const actorNameInput = document.getElementById('actorName');
    if (actorNameInput) actorNameInput.value = '';
    
    const modal = document.getElementById('addActorModal');
    if (modal) modal.style.display = 'flex';
}

function showRemoveActorModal() {
    const select = document.getElementById('removeActorMovieSelect');
    if (select) {
        if (movies.length > 0) {
            select.innerHTML = movies.map((movie, index) => 
                `<option value="${index}">${escapeHtml(movie.title)} (${escapeHtml(movie.director)})</option>`
            ).join('');
            updateActorsList();
        } else {
            select.innerHTML = '<option disabled>Нет фильмов</option>';
            const actorSelect = document.getElementById('removeActorSelect');
            if (actorSelect) actorSelect.innerHTML = '<option disabled>Нет актеров</option>';
        }
    }
    const modal = document.getElementById('removeActorModal');
    if (modal) modal.style.display = 'flex';
}

function updateActorsList() {
    const movieSelect = document.getElementById('removeActorMovieSelect');
    const actorSelect = document.getElementById('removeActorSelect');
    
    if (!movieSelect || !actorSelect) return;
    
    const movieIndex = movieSelect.value;
    
    if (movieIndex && movies[movieIndex] && movies[movieIndex].actors.length > 0) {
        actorSelect.innerHTML = movies[movieIndex].actors.map(actor => 
            `<option value="${escapeHtml(actor)}">${escapeHtml(actor)}</option>`
        ).join('');
        actorSelect.disabled = false;
    } else if (movieIndex && movies[movieIndex]) {
        actorSelect.innerHTML = '<option disabled>Нет актеров для удаления</option>';
        actorSelect.disabled = true;
    } else {
        actorSelect.innerHTML = '<option disabled>Выберите фильм</option>';
        actorSelect.disabled = true;
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

// Event Handlers
async function deleteMovie() {
    const select = document.getElementById('deleteMovieSelect');
    const index = select.value;
    
    if (index && index !== 'null' && movies[index]) {
        if (confirm('Вы уверены, что хотите удалить этот фильм?')) {
            await deleteMovieAsync(parseInt(index));
            closeModal('deleteMovieModal');
        }
    } else {
        alert('Пожалуйста, выберите фильм для удаления');
    }
}

async function removeActor() {
    const movieSelect = document.getElementById('removeActorMovieSelect');
    const actorSelect = document.getElementById('removeActorSelect');
    
    const movieIndex = movieSelect.value;
    const actorName = actorSelect.value;
    
    if (movieIndex && actorName && actorName !== 'Выберите актера' && movies[movieIndex]) {
        await removeActorFromMovieAsync(parseInt(movieIndex), actorName);
        closeModal('removeActorModal');
    } else {
        alert('Пожалуйста, выберите фильм и актера для удаления');
    }
}

// Form Submissions
const addMovieForm = document.getElementById('addMovieForm');
if (addMovieForm) {
    addMovieForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('movieTitle').value;
        const director = document.getElementById('movieDirector').value;
        
        if (title && director) {
            const movie = new Movie(title, director);
            await addMovieAsync(movie);
            document.getElementById('addMovieForm').reset();
            closeModal('addMovieModal');
        } else {
            alert('Пожалуйста, заполните все поля');
        }
    });
}

const addActorForm = document.getElementById('addActorForm');
if (addActorForm) {
    addActorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const movieIndex = document.getElementById('addActorMovieSelect').value;
        const actorName = document.getElementById('actorName').value;
        
        if (movieIndex && actorName && movies[movieIndex]) {
            await addActorToMovieAsync(parseInt(movieIndex), actorName);
            document.getElementById('addActorForm').reset();
            closeModal('addActorModal');
        } else {
            alert('Пожалуйста, выберите фильм и введите имя актера');
        }
    });
}

// Helper function to escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList && event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// Initialize
loadFromStorage();
renderUI();