const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 8080,
  path: '/api/v1/auth/staff/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const loginRes = JSON.parse(data);
    const token = loginRes.data.token;
    
    http.get({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/appointments',
      headers: { 'Authorization': 'Bearer ' + token }
    }, (res2) => {
      let data2 = '';
      res2.on('data', chunk => data2 += chunk);
      res2.on('end', () => {
        console.log("Appointments Response:");
        console.log(data2.substring(0, 500) + (data2.length > 500 ? "..." : ""));
      });
    });
  });
});

req.write(JSON.stringify({ email: 'admin@gmail.com', password: 'Trustcare@2026' }));
req.end();
