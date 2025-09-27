// База знаний по щитовидной железе (КР РФ)
const THYROID_KNOWLEDGE = {
    references: {
        TSH: { min: 0.4, max: 4.0, unit: "мМЕ/л" },
        FREE_T4: { min: 11.0, max: 22.0, unit: "пмоль/л" },
        FREE_T3: { min: 3.5, max: 8.0, unit: "пмоль/л" },
        ANTI_TPO: { max: 34.0, unit: "МЕ/мл" },
        ANTI_TG: { max: 115.0, unit: "МЕ/мл" }
    },

   analyzeComplete: function(tsh, t4, t3, atpo, atg) {
    if (!tsh) return null;

    let diagnosis = "";
    let treatment = "";
    let recommendations = [];
    let autoimmuneNote = "";

    // Проверяем аутоиммунный процесс
    if (atpo > 34) {
        autoimmuneNote = " (аутоиммунный процесс)";
        recommendations.push("Высокий уровень Анти-ТПО подтверждает аутоиммунный генез");
    }
    
    if (atg > 115) {
        autoimmuneNote = " (аутоиммунный тиреоидит)";
        recommendations.push("Повышены Анти-ТГ - маркер аутоиммунной агрессии");
    }

    // Диагностика по КР РФ
    if (tsh > 4.0 && t4 < 11.0) {
        diagnosis = "🔴 Первичный манифестный гипотиреоз" + autoimmuneNote;
        treatment = "Заместительная терапия левотироксином 1.6 мкг/кг/сут";
        recommendations.push("Определить Анти-ТПО для уточнения генеза", "УЗИ щитовидной железы", "Контроль ТТГ через 6-8 недель");
    }
    else if (tsh < 0.4 && (t4 > 22.0 || t3 > 8.0)) {
        diagnosis = "🔴 Манифестный тиреотоксикоз" + autoimmuneNote;
        treatment = "Тиреостатики, радиойодтерапия или хирургическое лечение";
        recommendations.push("АТ-рТТГ для дифференциальной диагностики", "УЗИ с ЦДК", "Сцинтиграфия по показаниям");
    }
    else if (tsh > 4.0 && t4 >= 11.0) {
        diagnosis = "🟡 Субклинический гипотиреоз" + autoimmuneNote;
        treatment = atpo > 34 ? "Рекомендуется терапия левотироксином" : "Наблюдение или терапия при ТТГ > 10 мМЕ/л";
        recommendations.push("Повторный контроль через 3-6 месяцев", "Оценка клинической симптоматики");
    }
    else if (tsh < 0.4 && (!t4 || t4 <= 22.0) && (!t3 || t3 <= 8.0)) {
        diagnosis = "🟡 Субклинический тиреотоксикоз" + autoimmuneNote;
        treatment = "Обследование для выявления причины";
        recommendations.push("Исключить прием тиреоидных гормонов", "Повторное исследование через 3-6 месяцев");
    }
    else {
        diagnosis = "🟢 Эутиреоз (норма)";
        treatment = "Плановое наблюдение";
        recommendations.push("Контроль по показаниям");
    }

    // Добавляем информацию об антителах в рекомендации
    if (atpo > 34) {
        recommendations.unshift("Анти-ТПО значительно повышены - высокий риск прогрессирования");
    }
    if (atg > 115) {
        recommendations.unshift("Анти-ТГ повышены - маркер аутоиммунного тиреоидита");
    }

    return {
        diagnosis: diagnosis,
        treatment: treatment,
        recommendations: recommendations
    };
}// Специальная функция для аутоиммунной диагностики
analyzeAutoimmune: function(atpo, atg, tsh, t4) {
    let autoimmuneInfo = "";
    let additionalTests = [];
    
    if (atpo > 34 || atg > 115) {
        autoimmuneInfo = "<br><strong>🔬 Аутоиммунный статус:</strong><br>";
        
        if (atpo > 34) {
            autoimmuneInfo += `- Анти-ТПО: ${atpo} МЕ/мл (повышены)<br>`;
            if (atpo > 100) {
                autoimmuneInfo += "- Высокий титр Анти-ТПО характерен для аутоиммунного тиреоидита<br>";
            }
        }
        
        if (atg > 115) {
            autoimmuneInfo += `- Анти-ТГ: ${atg} МЕ/мл (повышены)<br>`;
        }
        
        // Дифференциальная диагностика по сочетанию с гормонами
        if (tsh > 4.0) {
            autoimmuneInfo += "- Сочетание с гипотиреозом: вероятен аутоиммунный тиреоидит (Хашимото)<br>";
            additionalTests.push("УЗИ щитовидной железы для оценки структуры");
        }
        else if (tsh < 0.4) {
            autoimmuneInfo += "- Сочетание с тиреотоксикозом: вероятна болезнь Грейвса<br>";
            additionalTests.push("АТ-рТТГ для подтверждения болезни Грейвса");
        }
        else {
            autoimmuneInfo += "- Носительство антител: риск развития dysfunction щитовидной железы<br>";
            additionalTests.push("Динамическое наблюдение 1 раз в 6-12 месяцев");
        }
    }
    
    return {
        info: autoimmuneInfo,
        tests: additionalTests
    };
}
