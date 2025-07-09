1. npm init -y
2. npm install express cors
3. project-root/
------------------------------------------
4.
├── db/
│   └── database.js
├── models/
├── routes/
├── controllers/
├── services/
├── setup.js
├── server.js
├── index.js
└── package.json
------------------------------------------
5. index.js
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the server');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
------------------------------------------
6. "scripts": {
  "start": "node server.js"
}
------------------------------------------
7. npm start  (o

