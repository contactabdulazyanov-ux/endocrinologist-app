// Расширенная логика приложения
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
    const autoimmune = THYROID_KNOWLEDGE.analyzeAutoimmune(atpo, atg, tsh, t4);
    
    if (result) {
        let diagnosisHTML = `<strong>Диагноз:</strong> ${result.diagnosis}`;
        
        // Добавляем аутоиммунную информацию
        if (autoimmune.info) {
            diagnosisHTML += autoimmune.info;
        }
        
        document.getElementById('detailedDiagnosis').innerHTML = diagnosisHTML;
        
        document.getElementById('treatmentPlan').innerHTML = 
            `<strong>Тактика лечения:</strong> ${result.treatment}`;
        
        // Объединяем рекомендации
        const allRecommendations = [...result.recommendations, ...autoimmune.tests];
        
        document.getElementById('recommendations').innerHTML = 
            `<strong>Рекомендации:</strong><ul>${
                allRecommendations.map(r => `<li>${r}</li>`).join('')
            }</ul>`;
        
        document.getElementById('advancedResult').style.display = 'block';
        document.getElementById('result').style.display = 'none';
    }
}

// Дополнительные функции
function showParameterInfo() {
    const info = `
ТТГ - основной маркер функции щитовидной железы
св.Т4 - основной гормон щитовидной железы
Анти-ТПО - маркер аутоиммунного тиреоидита
Нормы согласно клиническим рекомендациям РФ
    `;
    alert(info);
}
