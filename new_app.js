// ОСНОВНАЯ ЛОГИКА ПРИЛОЖЕНИЯ
class ThyroidApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.fillTestData();
    }

    setupEventListeners() {
        // Автопроверка при вводе данных
        document.getElementById('tsh').addEventListener('input', (e) => {
            this.checkTSH(parseFloat(e.target.value));
        });
    }

    checkTSH(tsh) {
        if (tsh > 10) {
            this.showWarning('Высокий уровень ТТГ требует немедленного внимания');
        } else if (tsh > 4) {
            this.showInfo('Уровень ТТГ повышен - рекомендуется определить св.Т4');
        }
    }

    analyzeComplete() {
        const data = this.getInputData();
        
        if (!data.tsh) {
            this.showError('Введите значение ТТГ для анализа');
            return;
        }

        this.showLoading(true);
        
        // Имитация обработки
        setTimeout(() => {
            const result = THYROID_KNOWLEDGE.algorithms.evaluateThyroidFunction(
                data.tsh, data.freeT4, data.freeT3, data.antiTPO, data.antiTG
            );
            
            this.displayResults(data, result);
            this.showLoading(false);
        }, 1000);
    }

    getInputData() {
        return {
            tsh: parseFloat(document.getElementById('tsh').value),
            freeT4: parseFloat(document.getElementById('freeT4').value),
            freeT3: parseFloat(document.getElementById('freeT3').value),
            antiTPO: parseFloat(document.getElementById('antiTPO').value),
            antiTG: parseFloat(document.getElementById('antiTG').value)
        };
    }

    displayResults(data, diagnosis) {
        const container = document.getElementById('results');
        
        let html = `
            <div class="diagnosis-card diagnosis-${diagnosis.severity}">
                <h3>${diagnosis.name}</h3>
                <div class="parameter-list">
                    <h4>Введенные параметры:</h4>
        `;

        // Показываем параметры
        for (const [key, value] of Object.entries(data)) {
            if (!isNaN(value)) {
                const evaluation = THYROID_KNOWLEDGE.utils.evaluateParameter(value, key.toUpperCase());
                html += `
                    <div class="parameter-item">
                        <span class="parameter-name">${this.getParameterName(key)}:</span>
                        <span class="parameter-value ${evaluation.status}">
                            ${THYROID_KNOWLEDGE.utils.formatValue(value, key.toUpperCase())} 
                            (${evaluation.text})
                        </span>
                    </div>
                `;
            }
        }

        html += `</div>`;

        // Рекомендации
        if (diagnosis.additionalTests) {
            html += `
                <div class="recommendation-box">
                    <h4>📋 Рекомендуемые дополнительные исследования:</h4>
                    <ul>${diagnosis.additionalTests.map(test => `<li>${test}</li>`).join('')}</ul>
                </div>
            `;
        }

        // Лечение
        if (diagnosis.treatment) {
            html += `
                <div class="treatment-protocol">
                    <h4>💊 Тактика лечения:</h4>
                    <p><strong>Препарат:</strong> ${diagnosis.treatment.drug}</p>
                    <p><strong>Дозировка:</strong> ${diagnosis.treatment.dose}</p>
                    <p><strong>Целевые значения:</strong> ${diagnosis.treatment.target}</p>
                    <p><strong>Мониторинг:</strong> ${diagnosis.treatment.monitoring}</p>
                </div>
            `;
        }

        // Общие рекомендации
        if (diagnosis.recommendations) {
            html += `
                <div class="recommendation-box">
                    <h4>👨‍⚕️ Рекомендации для пациента:</h4>
                    <ul>${diagnosis.recommendations.map(rec => `<li>${rec}</li>`).join('')}</ul>
                </div>
            `;
        }

        html += `</div>`;
        container.innerHTML = html;
        container.style.display = 'block';
    }

    getParameterName(key) {
        const names = {
            tsh: 'ТТГ',
            freeT4: 'св. Т4',
            freeT3: 'св. Т3', 
            antiTPO: 'Анти-ТПО',
            antiTG: 'Анти-ТГ'
        };
        return names[key] || key;
    }

    fillTestData() {
        // Автозаполнение тестовыми данными
        document.getElementById('tsh').value = '8.5';
        document.getElementById('freeT4').value = '9.0';
        document.getElementById('antiTPO').value = '250';
    }

    clearAll() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => input.value = '');
        document.getElementById('results').style.display = 'none';
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
    }

    showError(message) {
        alert('Ошибка: ' + message);
    }

    showWarning(message) {
        console.warn('Предупреждение: ' + message);
    }

    showInfo(message) {
        console.info('Информация: ' + message);
    }
}

// Глобальные функции для HTML
function analyzeComplete() {
    window.thyroidApp.analyzeComplete();
}

function clearAll() {
    window.thyroidApp.clearAll();
}

function fillExample() {
    window.thyroidApp.fillTestData();
}

function showInfo(param) {
    const info = THYROID_KNOWLEDGE.parametersInfo[param];
    if (info) {
        document.getElementById('modalContent').innerHTML = `
            <h3>${info.name}</h3>
            <p><strong>Клиническое значение:</strong> ${info.significance}</p>
            <div class="interpretation">
                <h4>Интерпретация результатов:</h4>
                <ul>
                    <li>Повышен: ${info.interpretation.high}</li>
                    <li>Понижен: ${info.interpretation.low}</li>
                    <li>Норма: ${info.interpretation.normal}</li>
                </ul>
            </div>
        `;
        document.getElementById('infoModal').style.display = 'block';
    }
}

function closeModal() {
    document.getElementById('infoModal').style.display = 'none';
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    window.thyroidApp = new ThyroidApp();
});
