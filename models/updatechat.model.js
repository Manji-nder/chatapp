const Myid = require("../models/myid");

async function update_chat_array(temp_chat_array,sender,reciver,room){

    return_val="";
    
    Myid.find({myid:sender}).then(res=>{
        result=res[0][reciver][1];
        result.push(temp_chat_array);
        insert_val=[room,result,new Date];
        return_val = Myid.updateOne({ myid: sender},{$set:{[reciver]:insert_val}}).then(res=>console.log(res,"inside update chat"))
    })
    
    return return_val;
}

module.exports = { update_chat_array };





