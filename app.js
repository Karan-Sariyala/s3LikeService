const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = 3000;

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});