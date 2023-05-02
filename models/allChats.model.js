const Myid = require("../models/myid");

async function all_chats_db(email){
    var req_obj={};
    await Myid.find({myid:email},{myid:0,_id:0,__v:0}).then((req)=>{
        req_obj=req
    })
    
    return req_obj
}

module.exports = { all_chats_db };