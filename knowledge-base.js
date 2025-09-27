// База знаний по щитовидной железе (КР РФ) - ИСПРАВЛЕННАЯ ВЕРСИЯ
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
        if (atpo > 34 || atg > 115) {
            autoimmuneNote = " (аутоиммунный процесс)";
            
            if (atpo > 34) {
                recommendations.push("Анти-ТПО повышены - маркер аутоиммунного тиреоидита");
            }
            if (atg > 115) {
                recommendations.push("Анти-ТГ повышены - подтверждает аутоиммунный генез");
            }
        }

        // Диагностика по КР РФ
        if (tsh > 4.0 && t4 < 11.0) {
            diagnosis = "🔴 Первичный манифестный гипотиреоз" + autoimmuneNote;
            treatment = "Заместительная терапия левотироксином 1.6 мкг/кг/сут";
            recommendations.push("УЗИ щитовидной железы", "Контроль ТТГ через 6-8 недель", "Липидный профиль");
        }
        else if (tsh < 0.4 && (t4 > 22.0 || (t3 && t3 > 8.0))) {
            diagnosis = "🔴 Манифестный тиреотоксикоз" + autoimmuneNote;
            treatment = "Тиреостатики, радиойодтерапия или хирургическое лечение";
            recommendations.push("АТ-рТТГ для дифференциальной диагностики", "УЗИ с ЦДК", "Сцинтиграфия по показаниям");
        }
        else if (tsh > 4.0 && (!t4 || t4 >= 11.0)) {
            diagnosis = "🟡 Субклинический гипотиреоз" + autoimmuneNote;
            
            if (atpo > 34 || tsh > 10.0) {
                treatment = "Рекомендуется терапия левотироксином";
            } else {
                treatment = "Наблюдение, контроль через 3-6 месяцев";
            }
            
            recommendations.push("Повторный контроль ТТГ и св.Т4", "Оценка клинической симптоматики");
        }
        else if (tsh < 0.4 && (!t4 || t4 <= 22.0) && (!t3 || t3 <= 8.0)) {
            diagnosis = "🟡 Субклинический тиреотоксикоз" + autoimmuneNote;
            treatment = "Обследование для выявления причины";
            recommendations.push("Исключить прием тиреоидных гормонов", "Повторное исследование через 3-6 месяцев");
        }
        else {
            diagnosis = "🟢 Эутиреоз (норма)";
            treatment = "Плановое наблюдение";
            
            if (atpo > 34 || atg > 115) {
                diagnosis += autoimmuneNote;
                recommendations.push("Носительство антител - динамическое наблюдение 1 раз в год");
            } else {
                recommendations.push("Контроль по показаниям");
            }
        }

        // Добавляем информацию об антителах в детали
        if (atpo > 34) {
            if (!autoimmuneNote) {
                diagnosis += " (Анти-ТПО повышены)";
            }
        }

        return {
            diagnosis: diagnosis,
            treatment: treatment,
            recommendations: recommendations
        };
    },

    // Функция для отображения значений параметров
    getParameterStatus: function(value, paramName) {
        const ref = this.references[paramName];
        if (!value || isNaN(value)) return "не введено";
        
        if (paramName === 'ANTI_TPO' || paramName === 'ANTI_TG') {
            return value > ref.max ? `ПОВЫШЕН (${value} ${ref.unit})` : `норма (${value} ${ref.unit})`;
        } else {
            if (value < ref.min) return `ПОНИЖЕН (${value} ${ref.unit})`;
            if (value > ref.max) return `ПОВЫШЕН (${value} ${ref.unit})`;
            return `норма (${value} ${ref.unit})`;
        }
    }
};
