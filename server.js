const app = require("./app.js")
const mongoose = require('mongoose');

const {DB_HOST, PORT = 9006} = process.env

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