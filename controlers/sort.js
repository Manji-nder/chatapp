function sortChat(socket,arr){

    const keys = Object.keys(arr);
    console.log(arr,keys,"keys")
    const chatarray=[]
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        chatarray.push([key,arr[key],arr[key][2]])
    }


    // flag = true;
    // c=0;
    // while(flag){
    //         flag=false;
    //         for (let i=0; i<arr.length -1;i++){
    //             if(arr[i]>arr[i+1]){
    //                 temp_val=arr[i];
    //                 arr[i]=arr[i+1];
    //                 arr[i+1]=temp_val;
    //                 flag=true
    //             }
    //         }
    // }
    console.log(chatarray)
    socket.emit("chats_from_server",chatarray);
    
}

module.exports={ sortChat };