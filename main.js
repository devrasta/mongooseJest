import express from "express";
import mongoose from "mongoose";
const app = express();

mongoose.connect(`mongodb://root:pass@database:27017`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    app.listen(5000, () => {
        console.log('listening on 5000')
    })
})
.catch(err => console.log(err));
