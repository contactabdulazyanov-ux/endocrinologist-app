// navigation.js - Единая навигация для всех страниц сайта
function createNavigation(currentPage = '') {
    // Определяем базовый путь в зависимости от местоположения страницы
    let basePath = '';
    
    // Если страница находится в папке thyroid/ (гипотиреоз или гипертиреоз)
    if (window.location.pathname.includes('/thyroid/')) {
        basePath = '../';
    }
    // Если страница находится в корне pages/thyroid/
    else if (window.location.pathname.includes('/pages/thyroid/')) {
        basePath = '../../';
    }
    
    const navHTML = `
        <nav class="main-menu">
            <a href="${basePath}index.html" ${currentPage === 'home' ? 'class="active"' : ''}>🏠 Главная</a>
            <a href="${basePath}pages/thyroid/index.html" ${currentPage === 'thyroid' ? 'class="active"' : ''}>🦋 Щитовидная железа</a>
            <a href="hypothyroidism.html" ${currentPage === 'hypothyroidism' ? 'class="active"' : ''}>📉 Гипотиреоз</a>
            <a href="hyperthyroidism.html" ${currentPage === 'hyperthyroidism' ? 'class="active"' : ''}>📈 Гипертиреоз</a>
        </nav>
    `;
    
    // Вставляем навигацию в элемент с id="main-nav"
    const navElement = document.getElementById('main-nav');
    if (navElement) {
        navElement.innerHTML = navHTML;
    }
}

// Автоматическое определение активной страницы
function autoDetectPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    switch(page) {
        case 'index.html':
        case '':
            return 'home';
        case 'thyroid.html':
        case 'index.html' && path.includes('/thyroid/'):
            return 'thyroid';
        case 'hypothyroidism.html':
            return 'hypothyroidism';
        case 'hyperthyroidism.html':
            return 'hyperthyroidism';
        default:
            return '';
    }
}

// Инициализация навигации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = autoDetectPage();
    createNavigation(currentPage);
});
