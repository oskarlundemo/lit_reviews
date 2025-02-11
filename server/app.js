
const express = require('express')
const PORT = process.env.PORT || 5000;

const app = express();

app.get('/api', (req, res) => {
    res.json({'users': ['oskar', 'lundemo', 'björn']})
})

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})
