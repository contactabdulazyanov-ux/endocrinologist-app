// ПОЛНАЯ БАЗА ЗНАНИЙ ПО ЩИТОВИДНОЙ ЖЕЛЕЗЕ (КР РФ)
const THYROID_KNOWLEDGE = {
    // Референсные значения
    references: {
        TSH: { min: 0.4, max: 4.0, unit: "мМЕ/л" },
        FREE_T4: { min: 11.0, max: 22.0, unit: "пмоль/л" },
        FREE_T3: { min: 3.5, max: 8.0, unit: "пмоль/л" },
        ANTI_TPO: { max: 34.0, unit: "МЕ/мл" },
        ANTI_TG: { max: 115.0, unit: "МЕ/мл" }
    },

    // Информация о показателях
    parametersInfo: {
        tsh: {
            name: "ТТГ (Тиреотропный гормон)",
            significance: "Наиболее чувствительный маркер функции щитовидной железы. Синтезируется в гипофизе.",
            interpretation: {
                high: "Снижение функции щитовидной железы (гипотиреоз)",
                low: "Повышение функции щитовидной железы (тиреотоксикоз)",
                normal: "Нормальная функция щитовидной железы"
            },
            clinicalNotes: [
                "Золотой стандарт скрининга патологии щитовидной железы",
                "Может быть ложно изменен при острых заболеваниях, беременности",
                "Имеет суточные колебания (максимум в 2-4 часа ночи)"
            ]
        },
        freeT4: {
            name: "св. Т4 (Свободный тироксин)",
            significance: "Основной гормон щитовидной железы, прогормон для Т3.",
            interpretation: {
                high: "Тиреотоксикоз, прием тиреоидных гормонов",
                low: "Гипотиреоз, тяжелый йодный дефицит",
                normal: "Нормальная продукция гормонов"
            }
        }
        // ... аналогично для других параметров
    },

    // Диагностические алгоритмы
    algorithms: {
        evaluateThyroidFunction: function(tsh, t4, t3, atpo, atg) {
            if (tsh > 4.0) {
                if (t4 < 11.0) return this.getHypothyroidismManifest(atpo);
                if (t4 >= 11.0) return this.getHypothyroidismSubclinical(tsh, atpo);
            }
            
            if (tsh < 0.4) {
                if (t4 > 22.0 || t3 > 8.0) return this.getThyrotoxicosisManifest(t4, t3, atpo);
                if (t4 <= 22.0 && t3 <= 8.0) return this.getThyrotoxicosisSubclinical();
            }
            
            return this.getEuthyroidism(atpo);
        },

        getHypothyroidismManifest: function(atpo) {
            const diagnosis = {
                type: "primary",
                name: "Первичный манифестный гипотиреоз",
                severity: "high",
                additionalTests: [
                    "Анти-ТПО для уточнения аутоиммунного генеза",
                    "УЗИ щитовидной железы",
                    "Липидный профиль (холестерин, ЛПНП)",
                    "Общий анализ крови (анемия)"
                ],
                treatment: {
                    drug: "Левотироксин (L-тироксин, Эутирокс)",
                    dose: "Стартовая доза 1.6 мкг/кг массы тела",
                    target: "Целевой ТТГ 0.5-2.5 мМЕ/л",
                    monitoring: "Контроль ТТГ через 6-8 недель, затем каждые 6-12 месяцев"
                },
                recommendations: [
                    "Начать заместительную терапию немедленно",
                    "Обучение пациента правильному приему препарата (утром натощак)",
                    "Контроль сердечно-сосудистой системы у пациентов старше 50 лет"
                ]
            };

            if (atpo > 34) {
                diagnosis.name += " (Аутоиммунный тиреоидит)";
                diagnosis.recommendations.push("Учитывать возможное сочетание с другими аутоиммунными заболеваниями");
            }

            return diagnosis;
        },

        getThyrotoxicosisManifest: function(t4, t3, atpo) {
            return {
                type: "primary", 
                name: "Манифестный тиреотоксикоз",
                severity: "high",
                additionalTests: [
                    "АТ-рТТГ (антитела к рецептору ТТГ)",
                    "УЗИ щитовидной железы с цветным допплеровским картированием",
                    "Сцинтиграфия щитовидной железы",
                    "Общий анализ крови, печеночные ферменты",
                    "ЭКГ (тахикардия, фибрилляция предсердий)"
                ],
                differential: this.getThyrotoxicosisDifferential(t4, t3, atpo),
                recommendations: [
                    "Срочная консультация эндокринолога",
                    "При тяжелом течении - госпитализация",
                    "Симптоматическая терапия (бета-блокаторы)"
                ]
            };
        }

        // ... остальные алгоритмы диагностики
    },

    // Вспомогательные функции
    utils: {
        evaluateParameter: function(value, parameter) {
            const ref = THYROID_KNOWLEDGE.references[parameter];
            if (value < ref.min) return { status: 'low', text: 'Понижен' };
            if (value > ref.max) return { status: 'high', text: 'Повышен' };
            return { status: 'normal', text: 'Норма' };
        },

        formatValue: function(value, parameter) {
            const ref = THYROID_KNOWLEDGE.references[parameter];
            return `${value} ${ref.unit}`;
        }
    }
};
