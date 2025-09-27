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
    
    if (result) {
        document.getElementById('detailedDiagnosis').innerHTML = 
            `<strong>Диагноз:</strong> ${result.diagnosis}`;
        
        document.getElementById('treatmentPlan').innerHTML = 
            `<strong>Тактика лечения:</strong> ${result.treatment}`;
        
        document.getElementById('recommendations').innerHTML = 
            `<strong>Рекомендации:</strong><ul>${
                result.recommendations.map(r => `<li>${r}</li>`).join('')
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
