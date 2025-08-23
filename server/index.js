require('dotenv').config();
const express = require('express');
const connectDb = require('./connectDb');
const cors = require('cors');
const userRouter = require('./routes/user')
const bookRouter = require('./routes/book')
const libraryRouter = require('./routes/library')
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5555;


app.use(cors({
  origin: ['https://book-stack-gamma.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'uploads')));



app.use('/user', userRouter);
app.use('/book', bookRouter);
app.use('/library', libraryRouter)

app.listen(PORT, () => {  
  connectDb();
  console.log(`Server is running on port ${PORT}`);
});