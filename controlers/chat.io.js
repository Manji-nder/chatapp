const { Socket } = require("socket.io")
const Myid = require("../models/myid")

function loadchat(io){

    room = "";
    io.on('connection',(Socket)=>{

        //console.log("a user connected")

        

        Socket.emit("allchats",[true,[]]);

        Socket.on("loadallchts",email=>{
            
            Myid.find({myid:email},{myid:0,_id:0,__v:0}).then((req)=>{
                ////console.log(req[0],"here is all chats")
                Socket.emit("allchats",[false,req]);


            })


        })

        Socket.on("insert_parti",async (value)=>{
            ////console.log("here is value", Socket.rooms);
            str_value=value;
            value=value.split(":")
            await check(value[1],value,str_value,Socket);
            await check(value[0],value,str_value,Socket);

            display(value,Socket,io)
            

            
        })

        Socket.on("load_chat_of_",async (value)=>{
            str_value=value;
            value=value.split(":")

            startRoom(value,Socket);
            display(value,Socket,io)

            
        })
         
        Socket.on('leave',(arr)=>{
            console.log(Socket.rooms,"bf");
            Socket.leave(arr);
            console.log(Socket.rooms,"af");
        })
                




    })

    

}

module.exports = {
    loadchat,
}

// check if already exist or not

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
    ////console.log(id1,id2)
    Myid.updateOne({ myid: id2, [id1]:{$exists:false}},{$set:{[id1]:[str_value,[]]}}).then((res)=>{

        Myid.updateOne({ myid: id1, [id2]:{$exists:false}},{$set:{[id2]:[str_value,[]]}}).then((res)=>{

            startRoom(value,Socket);


       
        }).catch((err)=>{
            ////console.log(err)
        })
        
    }).catch((err)=>{
        ////console.log(err)
    })
    
   

    

}

function display(value,Socket,io){

    Socket.on("join",(room1)=>{
        room=room1
        Socket.join(room);
        Myid.find({myid:value[1]}).then(res=>{
            console.log("a----------------------------------------------------------------------------------a")
            Socket.emit('prev_Chat',res[0][value[0]][1]);
        }

        )
        
        
    })

    
    Socket.on("msgFromClient",async d=>{
        d_m=d.msg_arr;
        res1=await updateChat(value[0],value[1],d);
        res1.push(d_m.join("*;*"))
        console.log(d.room,"this is room id in update")
        insert_val=[d.room,res1];
        Myid.updateOne({ myid: value[1]},{$set:{[value[0]]:insert_val}}).then(res=>{
            ////console.log(res,"inserted in db1")
        });

        d_m[0]='r';
        res2=await updateChat(value[1],value[0],d);
        res2.push(d_m.join("*;*"))
        insert_val2=[d.room,res2];
        Myid.updateOne({ myid: value[0]},{$set:{[value[1]]:insert_val2}}).then(res=>{
            ////console.log(res,"inserted in db2")
        });
        Socket.to(d.room).emit('msgFromServer',d_m);
    })
    
    async function updateChat(id1,id2,d){
        pchat=await prevChat(id2,id1);
        return pchat;
        }

    async function prevChat(sen,rec){

        result1 = await Myid.find({myid:sen}).then(res=>{
            ////console.log(res[0][rec][1],"prev chat")
            return res[0][rec][1];
        })
        return result1
    }

}

function startRoom(value,Socket){

    a=value[0]+" -_id"
    b=value[0]
    Myid.find({myid:value[1]}).select( a).then((req)=>{

        //console.log(req,"<<<<<<<----->>>>>>>>>",req[0][b][0])
        Socket.emit("start_room",req[0][b][0]);

    })
    
}

