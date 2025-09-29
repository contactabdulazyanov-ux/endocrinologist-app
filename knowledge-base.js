// База знаний по щитовидной железе (КР РФ) - ПОЛНАЯ ВЕРСИЯ
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
        let severity = "success";
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
            severity = "danger";
        }
        else if (tsh < 0.4 && (t4 > 22.0 || (t3 && t3 > 8.0))) {
            diagnosis = "🔴 Манифестный тиреотоксикоз" + autoimmuneNote;
            treatment = "Тиреостатики, радиойодтерапия или хирургическое лечение";
            recommendations.push("АТ-рТТГ для дифференциальной диагностики", "УЗИ с ЦДК", "Сцинтиграфия по показаниям");
            severity = "danger";
        }
        else if (tsh > 4.0 && (!t4 || t4 >= 11.0)) {
            diagnosis = "🟡 Субклинический гипотиреоз" + autoimmuneNote;
            
            if (atpo > 34 || tsh > 10.0) {
                treatment = "Рекомендуется терапия левотироксином";
            } else {
                treatment = "Наблюдение, контроль через 3-6 месяцев";
            }
            
            recommendations.push("Повторный контроль ТТГ и св.Т4", "Оценка клинической симптоматики");
            severity = "warning";
        }
        else if (tsh < 0.4 && (!t4 || t4 <= 22.0) && (!t3 || t3 <= 8.0)) {
            diagnosis = "🟡 Субклинический тиреотоксикоз" + autoimmuneNote;
            treatment = "Обследование для выявления причины";
            recommendations.push("Исключить прием тиреоидных гормонов", "Повторное исследование через 3-6 месяцев");
            severity = "warning";
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
            severity = "success";
        }

        return {
            diagnosis: diagnosis,
            treatment: treatment,
            recommendations: recommendations,
            severity: severity
        };
    },

    // Калькулятор дозы L-тироксина
    calculateLThyroxineDose: function(weight, age, tsh, hasHeartDisease = false) {
        let dosePerKg;
        
        if (age >= 60 || hasHeartDisease || tsh > 20) {
            dosePerKg = 1.0;
        } else if (age >= 40) {
            dosePerKg = 1.2;
        } else {
            dosePerKg = 1.6;
        }
        
        const calculatedDose = Math.round(weight * dosePerKg);
        return Math.round(calculatedDose / 25) * 25;
    },

    // Калькулятор коррекции дозы
    calculateDoseAdjustment: function(currentDose, currentTsh, targetTsh = 2.5) {
        if (currentTsh > 4.0) {
            return { adjustment: 25, direction: 'increase', recommendation: `Увеличить дозу на 25 мкг/сут (до ${currentDose + 25} мкг/сут)` };
        } else if (currentTsh < 0.1) {
            return { adjustment: -25, direction: 'decrease', recommendation: `Уменьшить дозу на 25 мкг/сут (до ${currentDose - 25} мкг/сут)` };
        } else if (currentTsh >= 0.5 && currentTsh <= 2.5) {
            return { adjustment: 0, direction: 'maintain', recommendation: "Доза адекватна, продолжить текущую терапию" };
        } else {
            return { adjustment: 12.5, direction: 'adjust', recommendation: "Рассмотреть коррекцию дозы на 12.5 мкг/сут" };
        }
    },

    // Калькулятор тиреостатиков
    calculateThionamideDose: function(condition, weight, freeT4) {
        let initialDose, maintenanceDose, duration, recommendations = [];
        
        switch(condition) {
            case 'mild':
                initialDose = "10-20 мг/сут";
                maintenanceDose = "5-10 мг/сут";
                duration = "12-18 месяцев";
                recommendations.push("Контроль ТТГ, св.Т4 каждые 4-6 недель");
                recommendations.push("При достижении эутиреоза - переход на поддерживающую дозу");
                break;
            case 'moderate':
                initialDose = "20-30 мг/сут";
                maintenanceDose = "5-15 мг/сут";
                duration = "12-18 месяцев";
                recommendations.push("Разделить дозу на 2 приема в начале лечения");
                recommendations.push("Контроль функции щитовидной железы каждые 2-4 недели");
                break;
            case 'severe':
                initialDose = "30-40 мг/сут";
                maintenanceDose = "10-20 мг/сут";
                duration = "18-24 месяцев";
                recommendations.push("Обязательное разделение дозы на 2-3 приема");
                recommendations.push("Частый контроль - каждые 2 недели в начале лечения");
                break;
        }
        
        recommendations.push("Контроль общего анализа крови (лейкоциты) каждые 2 недели в первые 2 месяца");
        recommendations.push("Обучение пациента симптомам агранулоцитоза");
        
        return {
            initialDose: initialDose,
            maintenanceDose: maintenanceDose,
            duration: duration,
            recommendations: recommendations,
            drugChoice: "Тиамазол (Тирозол)"
        };
    },

    // Мониторинг эффективности L-T4
    monitorLt4Effectiveness: function(currentDose, currentTsh, currentT4 = null) {
        let assessment = "";
        let recommendation = "";
        let color = "";
        let nextSteps = [];
        
        if (currentTsh >= 0.5 && currentTsh <= 2.5) {
            assessment = "🟢 ОПТИМАЛЬНЫЙ КОНТРОЛЬ";
            recommendation = "Текущая доза адекватна";
            color = "#059669";
            nextSteps = [
                "Продолжать текущую дозу",
                "Контроль ТТГ через 6-12 месяцев",
                "При стабильном состоянии - контроль через 1 год"
            ];
        } else if (currentTsh > 2.5 && currentTsh <= 4.0) {
            assessment = "🟡 СУБОПТИМАЛЬНЫЙ КОНТРОЛЬ";
            recommendation = "Рассмотреть увеличение дозы на 12.5-25 мкг/сут";
            color = "#d97706";
            nextSteps = [
                "Увеличить дозу на 12.5-25 мкг/сут",
                "Контроль ТТГ через 6-8 недель",
                "Оценить комплаенс пациента"
            ];
        } else if (currentTsh > 4.0) {
            assessment = "🔴 НЕДОСТАТОЧНЫЙ КОНТРОЛЬ";
            recommendation = `Увеличить дозу на 25-50 мкг/сут (до ${currentDose + 25}-${currentDose + 50} мкг/сут)`;
            color = "#dc2626";
            nextSteps = [
                `Увеличить дозу до ${currentDose + 25}-${currentDose + 50} мкг/сут`,
                "Контроль ТТГ через 6-8 недель",
                "Проверить правильность приема препарата"
            ];
        } else if (currentTsh < 0.1) {
            assessment = "🔴 ПЕРЕДОЗИРОВКА";
            recommendation = `Уменьшить дозу на 25 мкг/сут (до ${currentDose - 25} мкг/сут)`;
            color = "#dc2626";
            nextSteps = [
                `Снизить дозу до ${currentDose - 25} мкг/сут`,
                "Контроль ТТГ через 4-6 недель",
                "Оценить симптомы тиреотоксикоза"
            ];
        }
        
        return {
            assessment: assessment,
            recommendation: recommendation,
            color: color,
            nextSteps: nextSteps
        };
    }
};
