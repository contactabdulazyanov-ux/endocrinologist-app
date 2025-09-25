function analyze() {
    const tsh = parseFloat(document.getElementById('tsh').value);
    const t4 = parseFloat(document.getElementById('t4').value);
    const atpo = parseFloat(document.getElementById('atpo').value);
    
    if (!tsh) {
        alert('Введите значение ТТГ для анализа');
        return;
    }
    
    let diagnosis = '';
    let recommendation = '';
    
    // Диагностическая логика по КР РФ
    if (tsh > 4.0 && t4 < 11.0) {
        diagnosis = '🔴 Вероятен первичный гипотиреоз';
        recommendation = 'Рекомендуется: исследование Анти-ТПО, УЗИ щитовидной железы, консультация эндокринолога. Рассмотреть терапию левотироксином.';
    } else if (tsh < 0.4 && t4 > 22.0) {
        diagnosis = '🔴 Вероятен тиреотоксикоз';
        recommendation = 'Рекомендуется: АТ-рТТГ, УЗИ с ЦДК, сцинтиграфия. Консультация эндокринолога для выбора тактики (тиреостатики, РЙТ, операция).';
    } else if (tsh > 4.0 && t4 >= 11.0) {
        diagnosis = '🟡 Субклинический гипотиреоз';
        recommendation = 'Наблюдение. Контроль ТТГ через 3-6 месяцев. При ТТГ > 10 мМЕ/л или наличии симптомов - рассмотреть терапию.';
    } else if (tsh < 0.4 && t4 <= 22.0) {
        diagnosis = '🟡 Субклинический тиреотоксикоз';
        recommendation = 'Обследование для выявления причины. Исключить прием тиреоидных гормонов.';
    } else {
        diagnosis = '🟢 Эутиреоз (норма)';
        recommendation = 'Показатели в пределах нормы. Плановое наблюдение.';
    }
    
    // Учет антител
    if (atpo > 34) {
        diagnosis += ' (Повышены Анти-ТПО)';
        recommendation += ' Учитывать возможный аутоиммунный генез.';
    }
    
    // Формируем результат
    let resultHTML = `
        <div class="diagnosis">${diagnosis}</div>
        <div class="parameter">
            <span>ТТГ:</span>
            <span class="${getStatusClass(tsh, 0.4, 4.0)}">${tsh} ${getStatusText(tsh, 0.4, 4.0)}</span>
        </div>
    `;
    
    if (t4) {
        resultHTML += `
            <div class="parameter">
                <span>св.Т4:</span>
                <span class="${getStatusClass(t4, 11.0, 22.0)}">${t4} ${getStatusText(t4, 11.0, 22.0)}</span>
            </div>
        `;
    }
    
    if (atpo) {
        resultHTML += `
            <div class="parameter">
                <span>Анти-ТПО:</span>
                <span class="${atpo > 34 ? 'high' : 'normal'}">${atpo} ${atpo > 34 ? 'Повышены' : 'Норма'}</span>
            </div>
        `;
    }
    
    resultHTML += `<div class="recommendation">${recommendation}</div>`;
    
    document.getElementById('result').innerHTML = resultHTML;
    document.getElementById('result').style.display = 'block';
}

function getStatusClass(value, min, max) {
    if (value < min) return 'low';
    if (value > max) return 'high';
    return 'normal';
}

function getStatusText(value, min, max) {
    if (value < min) return '(Понижен)';
    if (value > max) return '(Повышен)';
    return '(Норма)';
}

function clearForm() {
    document.getElementById('tsh').value = '';
    document.getElementById('t4').value = '';
    document.getElementById('atpo').value = '';
    document.getElementById('result').style.display = 'none';
}

// Автозаполнение для тестирования
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('tsh').value = '8.5';
    document.getElementById('t4').value = '9.0';
    document.getElementById('atpo').value = '250';
});
