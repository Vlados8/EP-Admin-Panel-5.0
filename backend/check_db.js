const sequelize = require('./src/config/database');
const { User, Inquiry, Category, Client } = require('./src/domain/models');

async function checkDb() {
  await sequelize.authenticate();
  
  const users = await User.findAll({ attributes: ['id', 'email', 'company_id'] });
  console.log("USERS:", JSON.stringify(users, null, 2));

  const inquiries = await Inquiry.findAll({ attributes: ['id', 'title', 'company_id'] });
  console.log("INQUIRIES:", JSON.stringify(inquiries.slice(0,2), null, 2));

  const clients = await Client.findAll({ attributes: ['id', 'name', 'company_id'] });
  console.log("CLIENTS:", JSON.stringify(clients.slice(0,2), null, 2));
  
  process.exit();
}

checkDb();
