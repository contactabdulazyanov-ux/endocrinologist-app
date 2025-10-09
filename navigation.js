// navigation.js - Единая навигация для всех страниц сайта
function createNavigation(currentPage = '') {
    // Определяем базовый путь в зависимости от местоположения страницы
    let basePath = '';
    
    // Если страница находится в папке thyroid/ (гипотиреоз или гипертиреоз)
    if (window.location.pathname.includes('/thyroid/')) {
        basePath = '../';
    }
    // Если страница находится в папке parathyroid/
    else if (window.location.pathname.includes('/parathyroid/')) {
        basePath = '../';
    }
    // Если страница находится в корне pages/thyroid/
    else if (window.location.pathname.includes('/pages/thyroid/')) {
        basePath = '../../';
    }
    // Если страница находится в корне pages/parathyroid/
    else if (window.location.pathname.includes('/pages/parathyroid/')) {
        basePath = '../../';
    }
    
    // Определяем навигацию для разных разделов
    let navHTML = '';
    
    if (window.location.pathname.includes('/thyroid/') || window.location.pathname.includes('/pages/thyroid/')) {
        // Навигация для раздела щитовидной железы
        navHTML = `
            <nav class="main-menu">
                <a href="${basePath}index.html" ${currentPage === 'home' ? 'class="active"' : ''}>🏠 Главная</a>
                <a href="${basePath}pages/thyroid/index.html" ${currentPage === 'thyroid' ? 'class="active"' : ''}>🦋 Щитовидная железа</a>
                <a href="hypothyroidism.html" ${currentPage === 'hypothyroidism' ? 'class="active"' : ''}>📉 Гипотиреоз</a>
                <a href="hyperthyroidism.html" ${currentPage === 'hyperthyroidism' ? 'class="active"' : ''}>📈 Гипертиреоз</a>
                <a href="nodular-goiter.html" ${currentPage === 'nodular-goiter' ? 'class="active"' : ''}>🎯 Узловой зоб</a>
                <a href="thyroiditis.html" ${currentPage === 'thyroiditis' ? 'class="active"' : ''}>🦋 Тиреоидиты</a>
            </nav>
        `;
    }
    else if (window.location.pathname.includes('/parathyroid/') || window.location.pathname.includes('/pages/parathyroid/')) {
        // Навигация для раздела паращитовидных желез
        navHTML = `
            <nav class="main-menu">
                <a href="${basePath}index.html" ${currentPage === 'home' ? 'class="active"' : ''}>🏠 Главная</a>
                <a href="${basePath}pages/thyroid/index.html">🦋 Щитовидная железа</a>
                <a href="${basePath}pages/parathyroid/index.html" ${currentPage === 'parathyroid' ? 'class="active"' : ''}>🦴 Паращитовидные железы</a>
                <a href="hyperparathyroidism.html" ${currentPage === 'hyperparathyroidism' ? 'class="active"' : ''}>📈 Гиперпаратиреоз</a>
                <a href="hypoparathyroidism.html" ${currentPage === 'hypoparathyroidism' ? 'class="active"' : ''}>📉 Гипопаратиреоз</a>
                <a href="parathyroid.html" ${currentPage === 'calculators' ? 'class="active"' : ''}>🧮 Калькуляторы</a>
            </nav>
        `;
    }
    else {
        // Навигация для главной страницы
        navHTML = `
            <nav class="main-menu">
                <a href="index.html" ${currentPage === 'home' ? 'class="active"' : ''}>🏠 Главная</a>
                <a href="pages/thyroid/index.html" ${currentPage === 'thyroid' ? 'class="active"' : ''}>🦋 Щитовидная железа</a>
                <a href="pages/parathyroid/index.html" ${currentPage === 'parathyroid' ? 'class="active"' : ''}>🦴 Паращитовидные железы</a>
                <a href="pages/diabetes/index.html" ${currentPage === 'diabetes' ? 'class="active"' : ''}>💉 Сахарный диабет</a>
                <a href="pages/adrenal/index.html" ${currentPage === 'adrenal' ? 'class="active"' : ''}>🧠 Надпочечники</a>
                <a href="pages/metabolic/index.html" ${currentPage === 'metabolic' ? 'class="active"' : ''}>⚖️ Обмен веществ</a>
            </nav>
        `;
    }
    
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
    const fullPath = window.location.pathname;

    // Определяем раздел
    if (fullPath.includes('/thyroid/') || fullPath.includes('/pages/thyroid/')) {
        switch(page) {
            case 'index.html':
            case '':
                return 'thyroid';
            case 'hypothyroidism.html':
                return 'hypothyroidism';
            case 'hyperthyroidism.html':
                return 'hyperthyroidism';
            case 'nodular-goiter.html':
                return 'nodular-goiter';
            case 'thyroiditis.html':
                return 'thyroiditis';
            default:
                return 'thyroid';
        }
    }
    else if (fullPath.includes('/parathyroid/') || fullPath.includes('/pages/parathyroid/')) {
        switch(page) {
            case 'index.html':
            case '':
                return 'parathyroid';
            case 'hyperparathyroidism.html':
                return 'hyperparathyroidism';
            case 'hypoparathyroidism.html':
                return 'hypoparathyroidism';
            case 'parathyroid.html':
                return 'calculators';
            default:
                return 'parathyroid';
        }
    }
    else {
        // Главная страница и другие разделы
        switch(page) {
            case 'index.html':
            case '':
                return 'home';
            default:
                if (fullPath.includes('/diabetes/')) return 'diabetes';
                if (fullPath.includes('/adrenal/')) return 'adrenal';
                if (fullPath.includes('/metabolic/')) return 'metabolic';
                return '';
        }
    }
}

// Инициализация навигации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = autoDetectPage();
    createNavigation(currentPage);
    
    // Добавляем обработчики для плавной прокрутки
    document.querySelectorAll('.main-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Функция для обновления навигации при изменении страницы
function updateNavigation() {
    const currentPage = autoDetectPage();
    createNavigation(currentPage);
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createNavigation, autoDetectPage, updateNavigation };
}
