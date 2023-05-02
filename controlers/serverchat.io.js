const { Socket } = require("socket.io")
const Myid = require("../models/myid");
const { all_chats_db } = require("../models/allChats.model");
const { update_chat_array } = require("../models/updatechat.model")
const socket = Socket;

function joinroom(io){
  
    io.on('connection', (socket) => {
      console.log('a user connected');

      socket.on("joinid",(id_to_join)=>{
          socket.join(id_to_join);
          console.log("socket.rooms")
      })

      socket.on("join",({data,id})=>{
        console.log(data,"data")
        socket.join(data);
        
        ((id)=>{
            const comp_chat= all_chats_db(id);
            comp_chat.then(req=>{
                socket.emit("complete_chat",req[0]);
            })
        })();

      })
  
      socket.on('leave',(arr)=>{
        console.log(socket.rooms,"bf");
        socket.leave(arr,"-----------leave-----------");
        console.log(socket.rooms,"af");
      })
    
      socket.on('m1',d=>{
        console.log("this got exected",d.room)
        socket.in(d.room).emit('m2',d.dd.myid);
        socket.in(d.room).emit('m2',d.room);
    
      })
    
      socket.on('disconnect', () => {
        console.log('user disconnected 1');
        
        
      });
  
      socket.on("msgFromClient",async ({msg_arr,room,you_me})=>{
        temp_chat_array=msg_arr.join("*;@#@;*");
        console.log(you_me)
        sender=you_me.split(":")[1];
        reciver=you_me.split(":")[0];
        update_sendre = await update_chat_array(temp_chat_array,sender,reciver,room);
        msg_arr[0]="r";
        temp_chat_array=msg_arr.join("*;@#@;*");
        update_sendre = await update_chat_array(temp_chat_array,reciver,sender,room);
        socket.in(room).emit("msgFromServer",msg_arr);
        console.log("-----------------------------<>______________")
        socket.join(reciver);
        io.to(reciver).emit("part_load_chat",[reciver,sender]);
        socket.leave(reciver);
      })

      socket.on("loadChatfromDb",(id)=>{
            const all_chat= all_chats_db(id);
            all_chat.then(req=>{
               
                socket.emit("chats_from_server",req[0]);
            })
      })

      socket.on("insert_parti",async value=>{
          str_value=value;
            value=value.split(":")
            await check(value[1],value,str_value,socket);
            await check(value[0],value,str_value,socket);
      })

      socket.on("load_given_chat",arr=>{

        Myid.find({myid:arr[0]}).then(res=>{
          result=res[0][arr[1]][1];
          socket.emit("take_chat",result);
          })
          
      })
    
    });


    
    }
  

async function check(M_id,value,str_value,Socket){
    
      
      Myid.find({myid:M_id}).then( async myid =>{
      
        if (myid.length > 0) {
            ////console.log('Found user:', myid);
          } else {
          
            const newEntry = new Myid({myid:M_id});

            try {
                await newEntry.save();
              } catch (error) {
                ////console.log(error);
              }
            
  
          }

          
    }).then(()=>addchat(value,str_value,Socket));

}

function addchat(value,str_value,Socket){
    id1=value[0]
    id2=value[1]
    ////console.log(value);
    ////console.log(id1,id2);
    Myid.updateOne({ myid: id2, [id1]:{$exists:false}},{$set:{[id1]:[str_value,[],new Date]}}).then((res)=>{

        Myid.updateOne({ myid: id1, [id2]:{$exists:false}},{$set:{[id2]:[str_value,[],new Date]}}).then((res)=>{

            startRoom(value,Socket);

        }).catch((err)=>{
            ////console.log(err)
        })
        
    }).catch((err)=>{
        ////console.log(err)
    })
    
   

    

}


function startRoom(value,Socket){

  a=value[0]+" -_id"
  b=value[0]
  Myid.find({myid:value[1]}).select( a).then((req)=>{

      //console.log(req,"<<<<<<<----->>>>>>>>>",req[0][b][0])
      Socket.emit("room_to_join",req[0][b][0]);
      console.log("executed room_to_join");
      Socket.emit("part_load_chat",[value[0],value[1]]);

  })
  
}
  
  module.exports = {joinroom};