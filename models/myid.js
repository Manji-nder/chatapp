const mongoose = require('./connection');

const nameSchema = new mongoose.Schema({myid:String},{strict:false });

const Myid = mongoose.model('Myid', nameSchema);

module.exports = Myid;