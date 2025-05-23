const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());

const port = process.env.PORT || 9000

app.use(express.json());

const userRouter = require('./User/userRouter');

app.use('/User', userRouter);

if(!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in .env file");
    process.exit(1);
}
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to the MongoDB successfully'))
.catch(err => {
    console.error("Error connecting to MOngoDB:",err);
    process.exit(1);
})
mongoose.connection.on('disconnected', () => {
    console.log("MongoDB disconnected");
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
