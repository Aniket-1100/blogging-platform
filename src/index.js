const express = require("express")
const path = require("path")
const app = express()
const LogInCollection = require("./mongodb")
const port = process.env.PORT || 3000
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))

app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})
app.post('/signup', async (req, res) => {
    try {
        const { name, password } = req.body;
        const existingUser = await LogInCollection.findOne({ name });

        if (existingUser) {
            return res.status(400).send("User already exists");
        }
        await LogInCollection.create({ name, password });
        res.status(201).render("home", { naming: name });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).send("Failed to create user");
    }

    res.status(201).render("home", {
        naming: req.body.name
    })
});
app.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await LogInCollection.findOne({ name });

        if (!user) {
            return res.status(401).send("User not found");
        }
        if (user.password !== password) {
            return res.status(401).send("Incorrect password");
        }

        res.redirect('/blog');
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).send("Login failed");
    }
});

app.listen(port, () => {
    console.log('port connected');
})