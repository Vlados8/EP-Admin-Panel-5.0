const bcrypt = require('bcryptjs');
const { Company, Role, User, Category, Subcategory, Question, Answer } = require('../../domain/models');

/**
 * Idempotent seeder to provision initial data on production/newly created databases.
 * Merges legacy roof/building questions with new technical PV/WP parameters.
 */
async function seedDatabase() {
    try {
        console.log('--- Initial Seeding Started ---');

        // 1. Create Default Company
        const [company] = await Company.findOrCreate({
            where: { name: 'EP Construction' },
            defaults: {
                billing_plan: 'pro'
            }
        });
        console.log('Company check/create: EP Construction');

        // 2. Create Roles
        const roleNames = ['Admin', 'Projektleiter', 'Gruppenleiter', 'Worker'];
        const roles = {};

        for (const name of roleNames) {
            const [role] = await Role.findOrCreate({
                where: { name },
                defaults: { name }
            });
            roles[name] = role;
            console.log(`Role check/create: ${name}`);
        }

        // 3. Create First Admin User
        const adminEmail = 'admin@example.com';
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 12);
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password_hash: hashedPassword,
                status: 'active',
                company_id: company.id,
                role_id: roles['Admin'].id
            });
            console.log('Admin user created: admin@example.com / admin123');
        }

        // 4. Decision Tree Categories (PV & WP)
        console.log('Seeding Merged Decision Tree...');

        // --- Cleanup Existing PV/WP for clean re-seed ---
        // (Optional but helpful for debugging structural changes)
        // await Category.destroy({ where: { name: ['Photovoltaik (PV)', 'Wärmepumpe (WP)'] } });

        // --- Photovoltaik (PV) ---
        const [catPV] = await Category.findOrCreate({
            where: { name: 'Photovoltaik (PV)', company_id: company.id },
            defaults: { description: 'Solaranlagen und Speicher', icon: 'fa-solar-panel', order_index: 0 }
        });

        const [pvSub] = await Subcategory.findOrCreate({
            where: { name: 'PV Konfiguration', category_id: catPV.id },
            defaults: { description: 'Dachdetails & Planung', order_index: 0 }
        });

        // Questions for PV (Merged Old + New)
        // Note: 'type' must match ENUM: 'radio', 'checkbox', 'input', 'select', 'slider'
        const questionsPV = [
            {
                text: 'Welche Form hat das Dach?',
                type: 'radio',
                answers: ['Satteldach', 'Pultdach', 'Flachdach', 'Sonstiges']
            },
            {
                text: 'Woraus besteht die Dacheindeckung?',
                type: 'radio',
                answers: ['Ziegel', 'Schiefer', 'Trapezblech', 'Eternit', 'Sonstiges']
            },
            {
                text: 'Wie hoch ist Ihr jährlicher Stromverbrauch?',
                type: 'slider',
                config: { min: 1000, max: 20000, step: 500, default: 4000 },
                unit: 'kWh'
            },
            {
                text: 'Gewünschte PV-Leistung auf dem Dach (kWp)?',
                type: 'radio',
                answers: ['Beratung durch Experten', 'Bis 5 kWp', '5-10 kWp', '10-15 kWp', 'Über 15 kWp']
            },
            {
                text: 'Benötigen Sie eine Wallbox (Ladestation)?',
                type: 'radio',
                answers: ['Ja, bitte mit planen', 'Nein, bereits vorhanden', 'Nein, nicht benötigt']
            },
            {
                text: 'Stromspeicher (Batterie) erwünscht?',
                type: 'radio',
                answers: ['Ja, bitte mit planen', 'Nein, nicht benötigt', 'Beratung dazu gewünscht']
            },
            {
                text: 'Wann soll die Installation erfolgen?',
                type: 'radio',
                answers: ['Sofort', 'In 3 Monaten', 'In 6 Monaten+', 'Noch in Planung']
            }
        ];

        for (let i = 0; i < questionsPV.length; i++) {
            const qData = questionsPV[i];
            const [question] = await Question.findOrCreate({
                where: { question_text: qData.text, subcategory_id: pvSub.id },
                defaults: { type: qData.type, config: qData.config, unit: qData.unit, order_index: i }
            });

            if (qData.answers) {
                for (let j = 0; j < qData.answers.length; j++) {
                    await Answer.findOrCreate({
                        where: { answer_text: qData.answers[j], question_id: question.id },
                        defaults: { order_index: j }
                    });
                }
            }
        }

        // --- Wärmepumpe (WP) ---
        const [catWP] = await Category.findOrCreate({
            where: { name: 'Wärmepumpe (WP)', company_id: company.id },
            defaults: { description: 'Effiziente Heizsysteme', icon: 'fa-fire-burner', order_index: 1 }
        });

        const [wpSub] = await Subcategory.findOrCreate({
            where: { name: 'WP Konfiguration', category_id: catWP.id },
            defaults: { description: 'Haus details & Planung', order_index: 0 }
        });

        // Questions for WP (Merged Old + New)
        const questionsWP = [
            {
                text: 'Art des Gebäudes?',
                type: 'radio',
                answers: ['Einfamilienhaus', 'Reihenhaus', 'Mehrfamilienhaus', 'Gewerbe']
            },
            {
                text: 'Wie groß ist die zu beheizende Wohnfläche?',
                type: 'slider',
                config: { min: 50, max: 500, step: 10, default: 150 },
                unit: 'm²'
            },
            {
                text: 'Voraussichtlicher Energiebedarf pro Jahr?',
                type: 'slider',
                config: { min: 5000, max: 50000, step: 1000, default: 20000 },
                unit: 'kWh'
            },
            {
                text: 'Was ist Ihre aktuelle Heizungsart?',
                type: 'radio',
                answers: ['Gasheizung', 'Ölheizung', 'Elektroheizung', 'Sonstiges']
            },
            {
                text: 'Wie erfolgt die Wärmeabgabe im Haus?',
                type: 'radio',
                answers: ['Fußbodenheizung', 'Heizkörper', 'Mix (Fußboden & Heizkörper)']
            },
            {
                text: 'Gebäude-Zustand / Dämmung?',
                type: 'radio',
                answers: ['Neubau / Passivhaus', 'Gut gedämmter Altbau', 'Teilsaniert', 'Ungedämmt']
            }
        ];

        for (let i = 0; i < questionsWP.length; i++) {
            const qData = questionsWP[i];
            const [question] = await Question.findOrCreate({
                where: { question_text: qData.text, subcategory_id: wpSub.id },
                defaults: { type: qData.type, config: qData.config, unit: qData.unit, order_index: i }
            });

            if (qData.answers) {
                for (let j = 0; j < qData.answers.length; j++) {
                    await Answer.findOrCreate({
                        where: { answer_text: qData.answers[j], question_id: question.id },
                        defaults: { order_index: j }
                    });
                }
            }
        }

        console.log('--- Initial Seeding Completed Successfully ---');
    } catch (err) {
        console.error('--- Seeding Error: ---');
        console.error(err);
    }
}

module.exports = seedDatabase;
