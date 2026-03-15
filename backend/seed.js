require('dotenv').config();
const sequelize = require('./src/config/database');
const { User, Role, Company, Note, Task, Subcontractor, Client, Category, Subcategory, Question, Answer, Inquiry, InquiryAnswer, Project, ProjectStage, ProjectStageImage, SupportTicket, SupportResponse } = require('./src/domain/models');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Need to drop and sync models to ensure fresh tables for the new architecture:
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await sequelize.sync({ force: false });
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Database wiped and models synced.');

        // 1. Create Company
        const [company, createdCompany] = await Company.findOrCreate({
            where: { name: 'EP Bauunternehmen GmbH' },
            defaults: {
                billing_plan: 'enterprise'
            }
        });
        console.log(`Company: ${company.name} (Created: ${createdCompany})`);

        // 2. Create Roles
        const roleNames = ['Worker', 'Gruppenleiter', 'Projektleiter', 'Büro', 'Admin'];
        const roles = {};
        for (const name of roleNames) {
            const [role, created] = await Role.findOrCreate({
                where: { name }
            });
            roles[name] = role;
            if (created) console.log(`Created Role: ${name}`);
        }

        // 3. Create Admin User
        const adminEmail = 'admin@ep-bau.de';
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const [adminUser, createdAdminUser] = await User.findOrCreate({
            where: { email: adminEmail },
            defaults: {
                name: 'System Admin',
                password_hash: hashedPassword,
                status: 'active',
                company_id: company.id,
                role_id: roles['Admin'].id
            }
        });

        // 4. Create Büro User
        const bueroEmail = 'buero@ep-bau.de';
        const [bueroUser, createdBueroUser] = await User.findOrCreate({
            where: { email: bueroEmail },
            defaults: {
                name: 'Sabine (Büro)',
                password_hash: hashedPassword,
                status: 'active',
                company_id: company.id,
                role_id: roles['Büro'].id
            }
        });

        if (createdAdminUser) {
            console.log(`\n🎉 Admin user created successfully! (${adminEmail})`);
        } else {
            // Force reset password to 'admin123' if it exists to be safe
            adminUser.password_hash = hashedPassword;
            await adminUser.save();
        }

        if (createdBueroUser) {
            console.log(`🎉 Büro user created successfully! (${bueroEmail})`);
        } else {
            bueroUser.password_hash = hashedPassword;
            await bueroUser.save();
        }

        // 5. Create Dummy Hierarchical Users for demonstration
        console.log('\nCreating Dummy Users...');

        // Projektleiter
        const [plUser] = await User.findOrCreate({
            where: { email: 'klaus.pl@ep-bau.de' },
            defaults: {
                name: 'Klaus Projektleiter',
                password_hash: hashedPassword,
                status: 'active',
                company_id: company.id,
                role_id: roles['Projektleiter'].id,
                manager_id: adminUser.id // Optional top level
            }
        });

        // Gruppenleiters
        const [glUser1] = await User.findOrCreate({
            where: { email: 'thomas.gl@ep-bau.de' },
            defaults: {
                name: 'Thomas Gruppenleiter',
                password_hash: hashedPassword,
                status: 'active',
                company_id: company.id,
                role_id: roles['Gruppenleiter'].id,
                manager_id: plUser.id
            }
        });

        const [glUser2] = await User.findOrCreate({
            where: { email: 'markus.gl@ep-bau.de' },
            defaults: {
                name: 'Markus Gruppenleiter',
                password_hash: hashedPassword,
                status: 'active',
                company_id: company.id,
                role_id: roles['Gruppenleiter'].id,
                manager_id: plUser.id
            }
        });

        // Workers for Thomas
        const [janUser] = await User.findOrCreate({
            where: { email: 'jan.w@ep-bau.de' },
            defaults: {
                name: 'Jan Worker',
                password_hash: hashedPassword,
                status: 'active',
                company_id: company.id,
                role_id: roles['Worker'].id,
                manager_id: glUser1.id
            }
        });
        const [peterUser] = await User.findOrCreate({
            where: { email: 'peter.w@ep-bau.de' },
            defaults: {
                name: 'Peter Worker',
                password_hash: hashedPassword,
                status: 'active',
                company_id: company.id,
                role_id: roles['Worker'].id,
                manager_id: glUser1.id
            }
        });

        // Workers for Markus
        const [lukasUser] = await User.findOrCreate({
            where: { email: 'lukas.w@ep-bau.de' },
            defaults: {
                name: 'Lukas Worker',
                password_hash: hashedPassword,
                status: 'inactive',
                company_id: company.id,
                role_id: roles['Worker'].id,
                manager_id: glUser2.id
            }
        });

        const userData = [adminUser, bueroUser, plUser, glUser1, glUser2, janUser, peterUser, lukasUser];

        // 6. Create Dummy Notes
        console.log('Creating Dummy Notes...');

        await Note.findOrCreate({
            where: { title: 'Material fehlt' },
            defaults: {
                content: 'Auf Baustelle A fehlen noch 5 Sack Zement. Bitte nachliefern.',
                date: new Date(),
                color: 'yellow',
                user_id: glUser1.id
            }
        });

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        await Note.findOrCreate({
            where: { title: 'Wetterwarnung' },
            defaults: {
                content: 'Morgen starker Regen erwartet. Dacharbeiten verschieben.',
                date: tomorrow,
                color: 'blue',
                user_id: plUser.id
            }
        });

        // 7. Create Dummy Tasks
        console.log('Creating Dummy Tasks...');

        await Task.findOrCreate({
            where: { title: 'Fundament gießen' },
            defaults: {
                description: 'Auf Baustelle Villa Schmidt das Fundament gießen laut Plan.',
                status: 'In Arbeit',
                assigned_to_id: janUser.id,
                created_by_id: glUser1.id
            }
        });

        await Task.findOrCreate({
            where: { title: 'Elektroinstallation prüfen' },
            defaults: {
                description: 'Prüfen der Installationen im Südkomplex vor der Abnahme.',
                status: 'Erledigt',
                assigned_to_id: glUser1.id,
                created_by_id: plUser.id
            }
        });

        // 8. Create Dummy Subcontractors
        console.log('Creating Dummy Subcontractors...');
        await Subcontractor.findOrCreate({
            where: { name: 'Müller Elektrotechnik' },
            defaults: {
                trade: 'Elektriker',
                contact_person: 'Hans Müller',
                email: 'info@mueller-elektro.de',
                phone: '0170 1234567',
                address: 'Stromweg 1',
                zip_code: '80331',
                city: 'München',
                hourly_rate: 65.00,
                status: 'active',
                notes: 'Zuverlässig für Großprojekte.',
                company_id: company.id
            }
        });
        await Subcontractor.findOrCreate({
            where: { name: 'Schmidt Sanitäranlagen' },
            defaults: {
                trade: 'Sanitär',
                contact_person: 'Peter Schmidt',
                email: 'kontakt@schmidt-sanitaer.de',
                phone: '0172 9876543',
                address: 'Wasserstraße 5',
                zip_code: '80469',
                city: 'München',
                hourly_rate: 70.00,
                status: 'active',
                company_id: company.id
            }
        });
        await Subcontractor.findOrCreate({
            where: { name: 'Dachdecker Profis GmbH' },
            defaults: {
                trade: 'Dachdecker',
                status: 'inactive',
                hourly_rate: 55.00,
                company_id: company.id
            }
        });

        // 9. Create Dummy Clients
        console.log('Creating Dummy Clients...');
        const [client1] = await Client.findOrCreate({
            where: { name: 'Immobilien Meier GmbH' },
            defaults: {
                contact_person: 'Herr Schmidt',
                email: 'info@immo-meier.de',
                phone: '089 123456',
                address: 'Hauptstraße 15',
                zip_code: '80331',
                city: 'München',
                type: 'company',
                status: 'active',
                notes: 'Stammkunde seit 2020.',
                company_id: company.id
            }
        });
        const [client2] = await Client.findOrCreate({
            where: { name: 'Baugenossenschaft Süd' },
            defaults: {
                contact_person: 'Frau Weber',
                email: 'bauleitung@bg-sued.de',
                phone: '089 987654',
                address: 'Südpark 3',
                zip_code: '81373',
                city: 'München',
                type: 'company',
                status: 'active',
                company_id: company.id
            }
        });
        const [client3] = await Client.findOrCreate({
            where: { name: 'Privatier Wagner' },
            defaults: {
                contact_person: 'Max Wagner',
                email: 'm.wagner@private.de',
                phone: '0151 5556667',
                address: 'Villenviertel 8',
                zip_code: '82031',
                city: 'Grünwald',
                type: 'private',
                status: 'lead',
                notes: 'Interesse an Badsanierung.',
                company_id: company.id
            }
        });
        const clientData = [client1, client2, client3];

        // 10. Create New Decision Tree Categories
        console.log('Creating Decision Tree Categories...');
        const [catPV] = await Category.findOrCreate({
            where: { name: 'Photovoltaik (PV)' },
            defaults: { description: 'Solaranlagen und Speicher', icon: 'fa-solar-panel', order_index: 0, company_id: company.id }
        });

        const [pvPlanung] = await Subcategory.findOrCreate({
            where: { name: 'PV Planung & Dach' },
            defaults: { description: 'Dachdetails klären', category_id: catPV.id, order_index: 0 }
        });

        // Question 1
        const qDachform = await Question.create({
            subcategory_id: pvPlanung.id,
            question_text: 'Welche Form hat das Dach?',
            type: 'buttons',
            order_index: 0
        });

        // Question 2 (Branch A)
        const qEindeckung = await Question.create({
            subcategory_id: pvPlanung.id,
            question_text: 'Woraus besteht die Dacheindeckung?',
            type: 'buttons',
            order_index: 1
        });

        // Question 3 (Branch B)
        const qFlachdachArt = await Question.create({
            subcategory_id: pvPlanung.id,
            question_text: 'Welche Abdichtung hat das Flachdach?',
            type: 'buttons',
            order_index: 2
        });

        // Question 4 (Merge)
        const qWann = await Question.create({
            subcategory_id: pvPlanung.id,
            question_text: 'Wann soll die Installation erfolgen?',
            type: 'buttons',
            order_index: 3
        });

        // Answers for Q1 (Routing)
        await Answer.create({ question_id: qDachform.id, answer_text: 'Satteldach', next_question_id: qEindeckung.id, order_index: 0 });
        await Answer.create({ question_id: qDachform.id, answer_text: 'Pultdach', next_question_id: qEindeckung.id, order_index: 1 });
        await Answer.create({ question_id: qDachform.id, answer_text: 'Flachdach', next_question_id: qFlachdachArt.id, order_index: 2 }); // Branches to Flachdach specific question

        // Answers for Q2
        await Answer.create({ question_id: qEindeckung.id, answer_text: 'Ziegel', next_question_id: qWann.id, order_index: 0 });
        await Answer.create({ question_id: qEindeckung.id, answer_text: 'Trapezblech', next_question_id: qWann.id, order_index: 1 });

        // Answers for Q3
        await Answer.create({ question_id: qFlachdachArt.id, answer_text: 'Bitumen', next_question_id: qWann.id, order_index: 0 });
        await Answer.create({ question_id: qFlachdachArt.id, answer_text: 'Folie', next_question_id: qWann.id, order_index: 1 });
        await Answer.create({ question_id: qFlachdachArt.id, answer_text: 'Kies', next_question_id: qWann.id, order_index: 2 });

        // Answers for Q4 (End of line -> Contact Form)
        await Answer.create({ question_id: qWann.id, answer_text: 'So schnell wie möglich', next_question_id: null, order_index: 0 });
        await Answer.create({ question_id: qWann.id, answer_text: 'In 3-6 Monaten', next_question_id: null, order_index: 1 });


        // --- WÄRMEPUMPE (WP) ---
        const [catWP] = await Category.findOrCreate({
            where: { name: 'Wärmepumpe (WP)' },
            defaults: { description: 'Heizsysteme und Installation', icon: 'fa-fire-burner', order_index: 1, company_id: company.id }
        });

        const [wpHaus] = await Subcategory.findOrCreate({
            where: { name: 'WP Gebäudeangaben' },
            defaults: { description: 'Haus details', category_id: catWP.id, order_index: 0 }
        });

        const qHausart = await Question.create({
            subcategory_id: wpHaus.id,
            question_text: 'Art des Gebäudes?',
            type: 'buttons',
            order_index: 0
        });

        const qWohnflaeche = await Question.create({
            subcategory_id: wpHaus.id,
            question_text: 'Wie groß ist die zu beheizende Wohnfläche?',
            type: 'slider', // For sliders, we don't necessarily have Answers in DB, or we can use Answers for routing if we want. But usually, a slider just progresses to the next question.
            config: { min: 50, max: 400, step: 10, default: 150 },
            unit: 'm²',
            order_index: 1
        });

        // Since it's a slider, we can just create one "Virtual" Answer that routes to the end, or handle sliders natively in frontend.
        // Let's create an "Any" answer to provide a next_question_id path if needed, though frontend can just fall back to Q+1 if next is null.
        await Answer.create({ question_id: qHausart.id, answer_text: 'Einfamilienhaus', next_question_id: qWohnflaeche.id, order_index: 0 });
        await Answer.create({ question_id: qHausart.id, answer_text: 'Reihenhaus', next_question_id: qWohnflaeche.id, order_index: 1 });
        await Answer.create({ question_id: qHausart.id, answer_text: 'Mehrfamilienhaus', next_question_id: qWohnflaeche.id, order_index: 2 });

        await Answer.create({ question_id: qWohnflaeche.id, answer_text: 'ANY', next_question_id: null, order_index: 0 });

        // --- WEITERE KATEGORIEN ---
        const [catElektro] = await Category.findOrCreate({
            where: { name: 'Elektroinstallation' },
            defaults: { description: 'Zählerschrank, Wallbox, Smart Home', icon: 'fa-bolt', order_index: 2, company_id: company.id }
        });

        const [catSanitaer] = await Category.findOrCreate({
            where: { name: 'Sanitär & Heizung' },
            defaults: { description: 'Badsanierung, Wasserrohre', icon: 'fa-faucet-drip', order_index: 3, company_id: company.id }
        });

        const [catDach] = await Category.findOrCreate({
            where: { name: 'Dach & Fassade' },
            defaults: { description: 'Dachdeckerarbeiten, Dämmung', icon: 'fa-house', order_index: 4, company_id: company.id }
        });

        const [catMaler] = await Category.findOrCreate({
            where: { name: 'Maler & Trockenbau' },
            defaults: { description: 'Wände streichen, Wände ziehen', icon: 'fa-paint-roller', order_index: 5, company_id: company.id }
        });

        const [catGarten] = await Category.findOrCreate({
            where: { name: 'Garten & Landschaftsbau' },
            defaults: { description: 'Pflasterarbeiten, Zäune', icon: 'fa-leaf', order_index: 6, company_id: company.id }
        });

        // Add a simple question for Elektro
        const [elZaehler] = await Subcategory.findOrCreate({
            where: { name: 'Zählerschrank / Hauptverteilung' },
            defaults: { description: 'Erneuerung Zähleranlagen', category_id: catElektro.id, order_index: 0 }
        });

        const qZaehlerArt = await Question.create({
            subcategory_id: elZaehler.id,
            question_text: 'Welche Leistung benötigen Sie für den Zählerschrank?',
            type: 'buttons',
            order_index: 0
        });

        await Answer.create({ question_id: qZaehlerArt.id, answer_text: 'Komplett neu', next_question_id: null, order_index: 0 });
        await Answer.create({ question_id: qZaehlerArt.id, answer_text: 'Erweiterung', next_question_id: null, order_index: 1 });
        await Answer.create({ question_id: qZaehlerArt.id, answer_text: 'Nur Prüfung', next_question_id: null, order_index: 2 });


        // 11. Create Dummy Inquiries
        console.log('Creating Dummy Inquiries...');

        const [inquiry1] = await Inquiry.findOrCreate({
            where: { title: 'Anfrage Solaranlage Meier' },
            defaults: {
                company_id: company.id,
                category_id: catPV.id,
                contact_name: 'Familie Meier',
                contact_email: 'meier.familie@example.com',
                contact_phone: '0151 1234567',
                location: '80331 München',
                status: 'new',
                notes: 'Kunde wünscht schnellen Rückruf.'
            }
        });

        // Fetch answers to link them to the inquiry
        const ansSatteldach = await Answer.findOne({ where: { answer_text: 'Satteldach' } });
        const ansZiegel = await Answer.findOne({ where: { answer_text: 'Ziegel' } });

        await InquiryAnswer.findOrCreate({
            where: { inquiry_id: inquiry1.id, question_id: qDachform.id },
            defaults: { answer_id: ansSatteldach.id, answer_value: 'Satteldach' }
        });
        await InquiryAnswer.findOrCreate({
            where: { inquiry_id: inquiry1.id, question_id: qEindeckung.id },
            defaults: { answer_id: ansZiegel.id, answer_value: 'Ziegel' }
        });

        const [inquiry2] = await Inquiry.findOrCreate({
            where: { title: 'Neue Wärmepumpe für Altbau' },
            defaults: {
                company_id: company.id,
                category_id: catWP.id,
                contact_name: 'Johannes Schmidt',
                contact_email: 'j.schmidt@example.com',
                location: 'Außenbezirk 12',
                status: 'contacted',
                notes: 'Hat bereits ein Angebot von Konkurrenz.'
            }
        });

        const ansEFH = await Answer.findOne({ where: { answer_text: 'Einfamilienhaus' } });

        await InquiryAnswer.findOrCreate({
            where: { inquiry_id: inquiry2.id, question_id: qHausart.id },
            defaults: { answer_id: ansEFH.id, answer_value: 'Einfamilienhaus' }
        });
        await InquiryAnswer.findOrCreate({
            where: { inquiry_id: inquiry2.id, question_id: qWohnflaeche.id },
            defaults: { answer_value: '140' } // Slider value
        });

        // 12. Create Dummy Projects & Stages
        console.log('Creating Dummy Projects & Stages...');

        const [project1] = await Project.findOrCreate({
            where: { project_number: 'EP-001' },
            defaults: {
                title: 'Sanierung Villa Schmidt',
                description: 'Komplettsanierung des Erdgeschosses inklusive Elektrik und Sanitär.',
                address: 'Goethestraße 12, 80336 München',
                status: 'Aktiv',
                progress: 35,
                start_date: new Date(),
                client_id: client1.id,
                created_by: adminUser.id
            }
        });

        const [project2] = await Project.findOrCreate({
            where: { project_number: 'EP-002' },
            defaults: {
                title: 'Neubau Wohnanlage Süd',
                description: 'Errichtung einer Wohnanlage mit 20 Einheiten.',
                address: 'Sonnenallee 5, 81373 München',
                status: 'Planung',
                progress: 10,
                start_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                client_id: client2.id,
                created_by: adminUser.id
            }
        });
        const projectData = [project1, project2];

        const stages = await ProjectStage.bulkCreate([
            { project_id: projectData[0].id, title: 'Baustelleneinrichtung', description: 'Aufstellen von Werkzeugen', assigned_to_id: userData[3].id, created_by_id: userData[0].id },
            { project_id: projectData[0].id, title: 'Abbrucharbeiten', description: 'Abriss alter Wände', assigned_to_id: userData[3].id, created_by_id: userData[0].id }
        ]);

        console.log('Creating Dummy Support Tickets & Responses...');
        const tickets = await SupportTicket.bulkCreate([
            {
                company_id: company.id,
                client_id: clientData[0].id,
                project_id: projectData[0].id,
                assigned_to_id: userData[0].id,
                subject: 'Wasserschaden Keller',
                description: 'Wir haben heute Morgen festgestellt, dass im Keller Wasser steht. Es scheint aus der Wand im Heizungskeller zu kommen. Bitte dringend prüfen!',
                status: 'open',
                priority: 'urgent'
            },
            {
                company_id: company.id,
                client_id: clientData[1].id,
                project_id: projectData[1].id,
                assigned_to_id: userData[3].id,
                subject: 'Fenster klemmt',
                description: 'Das Fenster im Erdgeschoss Wohnzimmer lässt sich nicht mehr richtig schließen.',
                status: 'new',
                priority: 'normal'
            }
        ]);

        await SupportResponse.bulkCreate([
            {
                ticket_id: tickets[0].id,
                user_id: userData[0].id,
                response_type: 'note',
                message: 'Team Sanitär ist informiert und wird in den nächsten 2 Stunden anrufen.'
            },
            {
                ticket_id: tickets[0].id,
                user_id: userData[0].id,
                response_type: 'email',
                message: 'Hallo Familie Schmidt, wir haben das Ticket erhalten. Unser Sanitär-Team (Wasser & Sanitär AG) ist informiert und wird sich in den nächsten 2 Stunden bei Ihnen melden.'
            }
        ]);


        console.log('Seed completed successfully. Dummy users, notes, tasks, subcontractors, clients, categories, inquiries, projects, and support tickets added.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
