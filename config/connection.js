const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://root:root@cluster0.mxtlndp.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})




module.exports = mongoose.connection