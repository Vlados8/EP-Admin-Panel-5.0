const { ApiKey, Category, Company } = require('../src/domain/models');

async function verify() {
    try {
        const cat = await Category.findOne({ where: { name: 'Photovoltaik (PV)' } });
        if (!cat) {
            console.log('PV Category not found');
            return;
        }

        const company = await Company.findOne();
        if (!company) {
             console.log('Company not found');
             return;
        }

        const { rawKey, hashedKey } = ApiKey.generateKey();
        const newKey = await ApiKey.create({
            name_or_domain: 'Edit Test Key',
            company_id: company.id,
            key_hash: hashedKey,
            allowed_category_ids: [cat.id],
            is_active: true
        });

        console.log('RAW KEY:', rawKey);
        console.log('API Key ID:', newKey.id);
        console.log('Initial Allowed Categories:', newKey.allowed_category_ids);
    } catch (err) {
        console.error('Verification failed:', err);
    } finally {
        process.exit();
    }
}

verify();
