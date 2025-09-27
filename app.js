// Расширенная логика приложения - ИСПРАВЛЕННАЯ ВЕРСИЯ
function analyzeComplete() {
    const tsh = parseFloat(document.getElementById('tsh').value);
    const t4 = parseFloat(document.getElementById('freeT4').value);
    const t3 = parseFloat(document.getElementById('freeT3').value);
    const atpo = parseFloat(document.getElementById('antiTPO').value);
    const atg = parseFloat(document.getElementById('antiTG').value);
    
    if (!tsh) {
        alert('Введите значение ТТГ для анализа');
        return;
    }
    
    const result = THYROID_KNOWLEDGE.analyzeComplete(tsh, t4, t3, atpo, atg);
    
    if (result) {
        // Создаем детальную информацию о параметрах
        let parametersHTML = "<strong>📊 Анализ параметров:</strong><br>";
        parametersHTML += `- ТТГ: ${THYROID_KNOWLEDGE.getParameterStatus(tsh, 'TSH')}<br>`;
        
        if (t4) parametersHTML += `- св.Т4: ${THYROID_KNOWLEDGE.getParameterStatus(t4, 'FREE_T4')}<br>`;
        if (t3) parametersHTML += `- св.Т3: ${THYROID_KNOWLEDGE.getParameterStatus(t3, 'FREE_T3')}<br>`;
        if (atpo) parametersHTML += `- Анти-ТПО: ${THYROID_KNOWLEDGE.getParameterStatus(atpo, 'ANTI_TPO')}<br>`;
        if (atg) parametersHTML += `- Анти-ТГ: ${THYROID_KNOWLEDGE.getParameterStatus(atg, 'ANTI_TG')}<br>`;
        
        document.getElementById('detailedDiagnosis').innerHTML = 
            `<strong>🏥 Диагноз:</strong> ${result.diagnosis}<br><br>${parametersHTML}`;
        
        document.getElementById('treatmentPlan').innerHTML = 
            `<strong>💊 Тактика лечения:</strong> ${result.treatment}`;
        
        document.getElementById('recommendations').innerHTML = 
            `<strong>📋 Рекомендации:</strong><ul>${
                result.recommendations.map(r => `<li>${r}</li>`).join('')
            }</ul>`;
        
        document.getElementById('advancedResult').style.display = 'block';
        document.getElementById('result').style.display = 'none';
    }
}

function showParameterInfo() {
    const info = `
📚 СПРАВКА ПО ПОКАЗАТЕЛЯМ:

ТТГ (0.4-4.0 мМЕ/л) - основной маркер функции щитовидной железы
св.Т4 (11.0-22.0 пмоль/л) - основной гормон щитовидной железы  
св.Т3 (3.5-8.0 пмоль/л) - активная форма гормона
Анти-ТПО (до 34 МЕ/мл) - маркер аутоиммунного тиреоидита
Анти-ТГ (до 115 МЕ/мл) - маркер аутоиммунного процесса

Нормы согласно клиническим рекомендациям РФ
    `;
    alert(info);
}

// Автозаполнение примера с аутоиммунным процессом
function fillAutoimmuneExample() {
    document.getElementById('tsh').value = '12.5';
    document.getElementById('freeT4').value = '8.5';
    document.getElementById('antiTPO').value = '350';
    document.getElementById('antiTG').value = '180';
}
