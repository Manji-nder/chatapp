const Myid = require("../models/myid")

function login(req,res){
    res.render('home')
}

function inside(req, res) {

    //console.log(Myid)
    if (req.user) {
      // User is authenticated, render dashboard
      
      M_id = req.user.emails[0].value;
      M_id=M_id.replace(/\./g,"#")



      Myid.find({myid:M_id}).then( myid =>{
        if (myid.length > 0) {
          //console.log('Found user:', myid);
        } else {
        
          const newEntry = new Myid({myid:M_id});

          newEntry.save().then((a)=>{
           // console.log(a);
          })

        }


       // console.log(req.user.emails[0].value)
        res.render("getrefered",{email:M_id.replace(/\#/g,".")});
      }).catch((err)=>{
        //console.log("inside not go id")
        res.send(err)
      })


      
      //res.render('inside',{email:req.user.emails[0].value});
    } else {
      // User is not authenticated, redirect to login page
      res.redirect('/outside');
    }
  };

  

module.exports= {
    login,
    inside
}