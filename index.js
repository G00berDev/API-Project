const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Specify the data folder path
const dataPath = path.join(__dirname, 'data'); // Use path.join for cross-platform compatibility

// Load JSON data (using path manipulation)
const moviesDataPath = path.join(dataPath, 'movies.json');
const actorsDataPath = path.join(dataPath, 'actors.json');

const moviesData = JSON.parse(fs.readFileSync(moviesDataPath, 'utf8'));
const actorsData = JSON.parse(fs.readFileSync(actorsDataPath, 'utf8'));

app.use(bodyParser.json());

// Base endpoint (Hello World)
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, './views/index.ejs')); // Serve the HTML file
});

// Movies endpoints
app.get('/movies', (req, res) => {
res.json(moviesData);
});

app.get('/movies/:id', (req, res) => {
const movie = moviesData.find(m => m.id === parseInt(req.params.id));
if (movie) {
res.json(movie);
} else {
res.status(404).json({ error: 'Movie not found' });
}
});

app.post('/movies', (req, res) => {
const newMovie = req.body;
newMovie.id = moviesData.length + 1; // Assign a new ID
moviesData.push(newMovie);
fs.writeFileSync(moviesDataPath, JSON.stringify(moviesData, null, 2));
res.status(201).json(newMovie);
});

app.put('/movies/:id', (req, res) => {
const updatedMovie = req.body;
const index = moviesData.findIndex(m => m.id === parseInt(req.params.id));
if (index !== -1) {
moviesData[index] = updatedMovie;
fs.writeFileSync(moviesDataPath, JSON.stringify(moviesData, null, 2));
res.json(updatedMovie);
} else {
res.status(404).json({ error: 'Movie not found' });
}
});

app.delete('/movies/:id', (req, res) => {
const index = moviesData.findIndex(m => m.id === parseInt(req.params.id));
if (index !== -1) {
moviesData.splice(index, 1);
fs.writeFileSync(moviesDataPath, JSON.stringify(moviesData, null, 2));
res.json({ message: 'Movie deleted successfully' });
} else {
res.status(404).json({ error: 'Movie not found' });
}
});

// Actors endpoints (similar to movies endpoints)

app.get('/actors', (req, res) => {
res.json(actorsData);
});

app.get('/actors/:id', (req, res) => {
const actor = actorsData.find(a => a.id === parseInt(req.params.id));
if (actor) {
res.json(actor);
} else {
res.status(404).json({ error: 'Actor not found' });
}
});

app.post('/actors', (req, res) => {
const newActor = req.body;
// Ensure required fields are present (e.g., name)
if (!newActor.name) {
return res.status(400).json({ error: 'Missing required field: name' });
}
newActor.id = actorsData.length + 1; // Assign a new ID
actorsData.push(newActor);
fs.writeFileSync(actorsDataPath, JSON.stringify(actorsData, null, 2));
res.status(201).json(newActor);
});

app.put('/actors/:id', (req, res) => {
const updatedActor = req.body;
const index = actorsData.findIndex(a => a.id === parseInt(req.params.id));
if (index !== -1) {
actorsData[index] = updatedActor;
fs.writeFileSync(actorsDataPath, JSON.stringify(actorsData, null, 2));
res.json(updatedActor);
} else {
res.status(404).json({ error: 'Actor not found' });
}
});

app.delete('/actors/:id', (req, res) => {
const index = actorsData.findIndex(a => a.id === parseInt(req.params.id));
if (index !== -1) {
actorsData.splice(index, 1);
fs.writeFileSync(actorsDataPath, JSON.stringify(actorsData, null, 2));
res.json({ message: 'Actor deleted successfully' });
} else {
res.status(404).json({ error: 'Actor not found' });
}
});

app.listen(port, () => {
console.log(`Server listening on port ${port}`);
});