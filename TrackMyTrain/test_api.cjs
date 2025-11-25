const https = require('https');

const options = {
    method: 'GET',
    hostname: 'irctc-train-api.p.rapidapi.com',
    path: '/api/v1/trains-between-stations?startStationCode=NDLS&endStationCode=MMCT&date=30-11-2025',
    headers: {
        'x-rapidapi-key': '37ebc84f84msh613d7f90a99435ap1c6b05jsn6577228717bd',
        'x-rapidapi-host': 'irctc-train-api.p.rapidapi.com'
    }
};

const req = https.request(options, function (res) {
    const chunks = [];

    res.on('data', function (chunk) {
        chunks.push(chunk);
    });

    res.on('end', function () {
        const body = Buffer.concat(chunks);
        console.log(body.toString());
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.end();
