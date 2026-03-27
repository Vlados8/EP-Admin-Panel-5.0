const { ApiKey, Company } = require('../src/domain/models');

async function verify() {
    try {
        const company = await Company.findOne();
        const { rawKey, hashedKey } = ApiKey.generateKey();
        const newKey = await ApiKey.create({
            name_or_domain: 'Unrestricted Key',
            company_id: company.id,
            key_hash: hashedKey,
            allowed_category_ids: null, // No restrictions
            is_active: true
        });

        console.log('RAW KEY:', rawKey);
    } catch (err) {
        console.error('Verification failed:', err);
    } finally {
        process.exit();
    }
}

verify();
