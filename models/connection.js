const mongoose = require('mongoose');

url_connect='mongodb+srv://samrinder821:A0Xui6nFJ0NXEQmE@chatappsample.qpucnft.mongodb.net/name?retryWrites=true&w=majority';

// Replace <dbname> with your database name
mongoose.connect(url_connect, { useUnifiedTopology: true, useNewUrlParser: true }).then(()=>{
    console.log('here we are')
});

module.exports=mongoose;