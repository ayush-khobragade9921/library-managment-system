const express = require("express");
// Use the correct JSON file path (data/user.json)
// const { users } = require("./data/user.json");
const app = express();

// Importing routers (not used in this snippet but can be used for modular routes)
const usersRouter = require('./routes/users.js');
const booksRouter = require('./routes/books.js');

const PORT = 8081;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ 
        message: "Home Page :-)" });
});

app.use('/users', usersRouter);
app.use('/books', booksRouter);



app.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`)
})