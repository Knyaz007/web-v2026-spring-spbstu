// Данные книг
const booksData = [
    { author: "Лев Толстой", publisher: "Эксмо", genre: "Роман", title: "Война и мир" },
    { author: "Лев Толстой", publisher: "АСТ", genre: "Роман", title: "Анна Каренина" },
    { author: "Лев Толстой", publisher: "Эксмо", genre: "Повесть", title: "Детство" },
    { author: "Фёдор Достоевский", publisher: "Азбука", genre: "Роман", title: "Преступление и наказание" },
    { author: "Фёдор Достоевский", publisher: "Эксмо", genre: "Роман", title: "Братья Карамазовы" },
    { author: "Фёдор Достоевский", publisher: "АСТ", genre: "Повесть", title: "Белые ночи" },
    { author: "Александр Пушкин", publisher: "Эксмо", genre: "Поэма", title: "Евгений Онегин" },
    { author: "Александр Пушкин", publisher: "Азбука", genre: "Роман", title: "Капитанская дочка" },
    { author: "Александр Пушкин", publisher: "АСТ", genre: "Сказка", title: "Сказка о царе Салтане" },
    { author: "Николай Гоголь", publisher: "Азбука", genre: "Повесть", title: "Мёртвые души" },
    { author: "Николай Гоголь", publisher: "Эксмо", genre: "Пьеса", title: "Ревизор" },
    { author: "Михаил Булгаков", publisher: "АСТ", genre: "Роман", title: "Мастер и Маргарита" },
    { author: "Михаил Булгаков", publisher: "Эксмо", genre: "Повесть", title: "Собачье сердце" },
    { author: "Иван Тургенев", publisher: "Азбука", genre: "Роман", title: "Отцы и дети" },
    { author: "Иван Тургенев", publisher: "АСТ", genre: "Повесть", title: "Муму" },
    { author: "Антон Чехов", publisher: "Эксмо", genre: "Рассказ", title: "Вишнёвый сад" },
    { author: "Антон Чехов", publisher: "Азбука", genre: "Пьеса", title: "Чайка" }
];

// Построение дерева из данных
function buildTree(books) {
    const tree = {};
    
    books.forEach(book => {
        // Уровень автора
        if (!tree[book.author]) {
            tree[book.author] = {};
        }
        
        // Уровень издательства
        if (!tree[book.author][book.publisher]) {
            tree[book.author][book.publisher] = {};
        }
        
        // Уровень жанра
        if (!tree[book.author][book.publisher][book.genre]) {
            tree[book.author][book.publisher][book.genre] = [];
        }
        
        // Уровень книги
        tree[book.author][book.publisher][book.genre].push(book.title);
    });
    
    return tree;
}

// Подсчет статистики
function calculateStats(tree) {
    let authors = 0;
    let publishers = 0;
    let genres = 0;
    let books = 0;
    
    for (const author in tree) {
        authors++;
        for (const publisher in tree[author]) {
            publishers++;
            for (const genre in tree[author][publisher]) {
                genres++;
                books += tree[author][publisher][genre].length;
            }
        }
    }
    
    return { authors, publishers, genres, books };
}

// Обновление статистики
function updateStats(tree) {
    const stats = calculateStats(tree);
    const statsContainer = document.getElementById('stats');
    
    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${stats.authors}</div>
            <div class="stat-label">Авторов</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.publishers}</div>
            <div class="stat-label">Издательств</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.genres}</div>
            <div class="stat-label">Жанров</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.books}</div>
            <div class="stat-label">Книг</div>
        </div>
    `;
}

// Создание HTML для узла дерева
function renderNode(data, level, path = []) {
    const ul = document.createElement('ul');
    ul.className = 'tree-node';
    
    if (Array.isArray(data)) {
        // Листья - названия книг
        data.forEach(bookTitle => {
            const li = document.createElement('li');
            li.className = 'level-book';
            
            const div = document.createElement('div');
            div.className = 'node-content';
            
            const toggleSpan = document.createElement('span');
            toggleSpan.className = 'toggle-btn empty';
            toggleSpan.textContent = '•';
            
            const iconSpan = document.createElement('span');
            iconSpan.className = 'node-icon';
            iconSpan.textContent = '📖';
            
            const labelSpan = document.createElement('span');
            labelSpan.className = 'node-label';
            labelSpan.textContent = bookTitle;
            
            div.appendChild(toggleSpan);
            div.appendChild(iconSpan);
            div.appendChild(labelSpan);
            li.appendChild(div);
            ul.appendChild(li);
        });
    } else {
        // Внутренние узлы
        for (const [key, value] of Object.entries(data)) {
            const li = document.createElement('li');
            
            let levelClass = '';
            let icon = '';
            let displayKey = key;
            
            if (level === 0) {
                levelClass = 'level-author';
                icon = '👤';
            } else if (level === 1) {
                levelClass = 'level-publisher';
                icon = '🏢';
            } else if (level === 2) {
                levelClass = 'level-genre';
                icon = '📚';
                // Добавляем количество книг в жанре
                const bookCount = Array.isArray(value) ? value.length : Object.keys(value).length;
                displayKey = `${key} (${bookCount})`;
            }
            
            li.className = levelClass;
            
            const div = document.createElement('div');
            div.className = 'node-content';
            
            const toggleSpan = document.createElement('span');
            toggleSpan.className = 'toggle-btn';
            toggleSpan.textContent = '▼';
            
            const iconSpan = document.createElement('span');
            iconSpan.className = 'node-icon';
            iconSpan.textContent = icon;
            
            const labelSpan = document.createElement('span');
            labelSpan.className = 'node-label';
            labelSpan.textContent = displayKey;
            
            div.appendChild(toggleSpan);
            div.appendChild(iconSpan);
            div.appendChild(labelSpan);
            
            // Создаем контейнер для дочерних элементов
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'children';
            const childrenContent = renderNode(value, level + 1, [...path, key]);
            childrenContainer.appendChild(childrenContent);
            
            li.appendChild(div);
            li.appendChild(childrenContainer);
            
            // Добавляем обработчик для сворачивания/разворачивания
            toggleSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                const isCollapsed = childrenContainer.classList.toggle('collapsed');
                toggleSpan.textContent = isCollapsed ? '▶' : '▼';
            });
            
            ul.appendChild(li);
        }
    }
    
    return ul;
}

// Глобальная переменная для хранения дерева
let currentTree = null;

// Инициализация дерева
function initTree() {
    const treeData = buildTree(booksData);
    currentTree = treeData;
    const treeContainer = document.getElementById('tree');
    treeContainer.innerHTML = '';
    const treeElement = renderNode(treeData, 0);
    treeContainer.appendChild(treeElement);
    updateStats(treeData);
}

// Развернуть все узлы
function expandAll() {
    const allChildren = document.querySelectorAll('.children');
    const allToggles = document.querySelectorAll('.toggle-btn:not(.empty)');
    
    allChildren.forEach(children => {
        children.classList.remove('collapsed');
    });
    
    allToggles.forEach(toggle => {
        if (toggle.textContent === '▶') {
            toggle.textContent = '▼';
        }
    });
}

// Свернуть все узлы
function collapseAll() {
    const allChildren = document.querySelectorAll('.children');
    const allToggles = document.querySelectorAll('.toggle-btn:not(.empty)');
    
    allChildren.forEach(children => {
        children.classList.add('collapsed');
    });
    
    allToggles.forEach(toggle => {
        if (toggle.textContent === '▼') {
            toggle.textContent = '▶';
        }
    });
}

// Сброс дерева (восстановление начального состояния)
function resetTree() {
    initTree();
}

// Поиск по дереву
function searchBooks(query) {
    if (!query.trim()) {
        initTree();
        return;
    }
    
    const filteredBooks = booksData.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.genre.toLowerCase().includes(query.toLowerCase())
    );
    
    const filteredTree = buildTree(filteredBooks);
    currentTree = filteredTree;
    const treeContainer = document.getElementById('tree');
    treeContainer.innerHTML = '';
    const treeElement = renderNode(filteredTree, 0);
    treeContainer.appendChild(treeElement);
    updateStats(filteredTree);
    expandAll();
}

// Добавление поиска
function addSearchBar() {
    const controls = document.querySelector('.controls');
    const searchDiv = document.createElement('div');
    searchDiv.style.marginLeft = 'auto';
    searchDiv.innerHTML = `
        <input type="text" id="searchInput" placeholder="🔍 Поиск книг, авторов или жанров..." style="padding: 10px; border-radius: 8px; border: 1px solid #ddd; width: 250px;">
    `;
    controls.appendChild(searchDiv);
    
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchBooks(e.target.value);
        }, 300);
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initTree();
    addSearchBar();
    
    // Добавляем обработчики для кнопок
    document.getElementById('expandAllBtn').addEventListener('click', expandAll);
    document.getElementById('collapseAllBtn').addEventListener('click', collapseAll);
    document.getElementById('resetBtn').addEventListener('click', resetTree);
});