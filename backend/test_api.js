const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign({ id: 'c54bc9c8-3607-444a-a101-4e4b1fea094d' }, process.env.JWT_SECRET, { expiresIn: '1d' });

async function testFetch() {
  const res = await fetch('http://localhost:3001/api/v1/inquiries', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  console.log("STATUS:", res.status);
  console.log("DATA:", JSON.stringify(data, null, 2));
}

testFetch();
