const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678', // matching application.yml
    database: 'clinic_system'
  });

  const [rows] = await connection.execute('SELECT * FROM appointment');
  console.log(`Found ${rows.length} appointments.`);
  if (rows.length > 0) {
    console.log(rows[0]);
  }
  
  await connection.end();
}

main().catch(console.error);
