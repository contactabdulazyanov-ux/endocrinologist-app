// navigation.js - Универсальная навигация для всех страниц
function createNavigation(currentPage = '') {
    const currentPath = window.location.pathname;
    let basePath = '';
    
    // Автоматическое определение базового пути
    if (currentPath.includes('/pages/thyroid/')) {
        // Мы находимся в папке pages/thyroid/
        basePath = '../../';
    } else if (currentPath.includes('/pages/')) {
        // Мы находимся в других папках pages/
        basePath = '../';
    } else if (currentPath.includes('/thyroid/')) {
        // Альтернативная структура папок
        basePath = '../';
    } else {
        // Мы в корне сайта
        basePath = './';
    }

    // Для страниц щитовидной железы - относительные пути внутри папки
    let thyroidBasePath = '';
    if (currentPath.includes('/thyroid/') || currentPath.includes('/pages/thyroid/')) {
        thyroidBasePath = './'; // Текущая папка
    } else {
        thyroidBasePath = 'pages/thyroid/';
    }

    const navHTML = `
        <nav class="main-menu">
            <a href="${basePath}index.html" ${currentPage === 'home' ? 'class="active"' : ''}>🏠 Главная сайта</a>
            <a href="${thyroidBasePath}index.html" ${currentPage === 'thyroid' ? 'class="active"' : ''}>🦋 Главная щитовидной</a>
            <a href="${thyroidBasePath}hypothyroidism.html" ${currentPage === 'hypothyroidism' ? 'class="active"' : ''}>📉 Гипотиреоз</a>
            <a href="${thyroidBasePath}hyperthyroidism.html" ${currentPage === 'hyperthyroidism' ? 'class="active"' : ''}>📈 Гипертиреоз</a>
            <a href="${thyroidBasePath}nodular-goiter.html" ${currentPage === 'nodular-goiter' ? 'class="active"' : ''}>🔘 Узловой зоб</a>
            <a href="${thyroidBasePath}thyroiditis.html" ${currentPage === 'thyroiditis' ? 'class="active"' : ''}>🔥 Тиреоидит</a>
        </nav>
    `;
    
    const navElement = document.getElementById('main-nav');
    if (navElement) {
        navElement.innerHTML = navHTML;
    }
}

function autoDetectPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    // Определяем страницу по имени файла
    switch(page) {
        case 'index.html':
        case '':
            return path.includes('/thyroid/') ? 'thyroid' : 'home';
        case 'hypothyroidism.html':
            return 'hypothyroidism';
        case 'hyperthyroidism.html':
            return 'hyperthyroidism';
        case 'nodular-goiter.html':
            return 'nodular-goiter';
        case 'thyroiditis.html':
            return 'thyroiditis';
        default:
            return '';
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = autoDetectPage();
    createNavigation(currentPage);
});
