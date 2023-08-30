
const express = require('express');

//const batchRoutes=require('./src/routes/batch.routes');

const app = express();
const port = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const cors = require("cors");
const req = require('express/lib/request');

const userRoutes = require("./src/config/routes/user.router")



//used to post data in json (middleware)
app.use(express.json());

process.env.TZ = "Asia/Calcutta";
// var corsOptions = {
//   origin: "http://localhost:8081"
// };

app.use(cors());


//CORS-HEADERS- Required for cross origin and cross server communication
app.use((req, res, next) => {
    res.setHeader('Access-Control_Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept,Authorization');

    res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS');
    next();
});

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())


app.use("/api/registrant", userRoutes);
// define a root route
app.get("/", (req, res) => {
    res.send("Hai Welcome To Our APR-MARATHON APP Signup and Signin Services!");
});

//app.use('/api/batch',batchRoutes);






app.listen(port, () => console.log(`app listening to ${port}`));

