import * as express from 'express';
import * as bodyParser from 'body-parser';
// import * as path from 'path';


let app = express();
const port = 3216;

// Set static folder
// app.use('/packages', express.static(path.join(__dirname, './../../node_modules')));
// app.use('/uicomps', express.static(path.join(__dirname, './../../bower_components')));
// app.use('/', express.static(path.join(__dirname, './../admin')));

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', 0);
  next();
});

// MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
import { router as apiRoutes } from './routes/apiroutes';
app.use('/api', apiRoutes);

// Serve
app.listen(port, () => {
    console.log('server listening on ', port);
});
