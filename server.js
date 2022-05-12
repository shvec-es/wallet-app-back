import app from "./app.js"
import mongoose from 'mongoose';

const {DB_HOST, PORT = 3001} = process.env

mongoose
    .connect(DB_HOST)
    .then(() => app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`)
      })
    )
    .catch((err) => {
        console.log(`Server failed to start. Error: ${err.message}`);
        process.exit(1);
    });