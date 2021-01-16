const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid'); 
const moment = require('moment');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

let rawData = fs.readFileSync(path.join(__dirname, './data', 'Entries.json'), 'utf8');
let entries = JSON.parse(rawData);


app.get('/', (req, res) => res.render('index', {
  title: 'SIMJO',
  entries
}));


app.post('/', (req, res) => {
  const newEntry = {
    id: uuid.v4(),
    date: moment().format("LLL"),
    title: req.body.title,
    text: req.body.text
  }

  if(!newEntry.title || !newEntry.text) {
    return res.status(400).json({msg: 'Please include title and text'});
  }

  entries.unshift(newEntry);
  let tempJSON = JSON.stringify(entries);
  fs.writeFile(path.join(__dirname, './data', 'Entries.json'), tempJSON, (err) => {
    console.log(err);
  });
  res.redirect("/");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});