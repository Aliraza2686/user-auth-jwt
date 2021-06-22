const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users')
const cookieParser = require('cookie-parser')
const {authMiddleware, checkUser} = require('./middleware/auth')

const app = express();

// middleware
app.use(express.static('public'));

//using json data

app.use(express.json())
app.use(cookieParser())
//using user router

app.use(userRouter)

// view engine
app.set('view engine', 'ejs');


mongoose.connect('mongodb://127.0.0.1:27017/recipes', {
  useNewUrlParser : true,
  useCreateIndex : true
})


// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', authMiddleware, (req, res) => res.render('smoothies'));



app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
