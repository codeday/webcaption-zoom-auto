const app = require('express')();
const bodyParser = require('body-parser');
const zoom = require('./zoom');

app.use(bodyParser.json({ type: () => true, }));
zoom(app);
app.get('/', (req, res) => res.send('ok'));

app.listen(8080, () => console.log(`Listening on http://0.0.0.0:8080/`))
