// navigation.js - Автономная навигация без изменений в HTML
function createUniversalNavigation() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    
    // Определяем где мы находимся
    const isInThyroidFolder = currentPath.includes('/thyroid/') || currentPath.includes('/pages/thyroid/');
    const isRoot = currentPath.endsWith('index.html') || currentPath.endsWith('/');
    
    // Создаем навигацию
    const nav = document.createElement('nav');
    nav.className = 'main-menu';
    nav.innerHTML = `
        ${!isInThyroidFolder ? `<a href="index.html" ${isRoot ? 'class="active"' : ''}>🏠 Главная сайта</a>` : '<a href="../../index.html">🏠 Главная сайта</a>'}
        ${isInThyroidFolder ? 
            `<a href="index.html" ${currentPage === 'index.html' ? 'class="active"' : ''}>🦋 Главная щитовидной</a>
             <a href="hypothyroidism.html" ${currentPage === 'hypothyroidism.html' ? 'class="active"' : ''}>📉 Гипотиреоз</a>
             <a href="hyperthyroidism.html" ${currentPage === 'hyperthyroidism.html' ? 'class="active"' : ''}>📈 Гипертиреоз</a>
             <a href="nodular-goiter.html" ${currentPage === 'nodular-goiter.html' ? 'class="active"' : ''}>🔘 Узловой зоб</a>
             <a href="thyroiditis.html" ${currentPage === 'thyroiditis.html' ? 'class="active"' : ''}>🔥 Тиреоидит</a>` :
            `<a href="pages/thyroid/index.html">🦋 Щитовидная железа</a>`
        }
    `;
    
    // Вставляем навигацию в начало body
    document.body.insertBefore(nav, document.body.firstChild);
    
    // Добавляем базовые стили если их нет
    if (!document.querySelector('#nav-styles')) {
        const styles = document.createElement('style');
        styles.id = 'nav-styles';
        styles.textContent = `
            .main-menu {
                background: #f5f5f5;
                padding: 15px;
                border-bottom: 2px solid #ddd;
                margin-bottom: 20px;
            }
            .main-menu a {
                margin-right: 15px;
                text-decoration: none;
                color: #333;
                padding: 5px 10px;
                border-radius: 4px;
            }
            .main-menu a:hover {
                background: #e0e0e0;
            }
            .main-menu a.active {
                background: #007cba;
                color: white;
            }
        `;
        document.head.appendChild(styles);
    }
}

// Запускаем при полной загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createUniversalNavigation);
} else {
    createUniversalNavigation();
}
