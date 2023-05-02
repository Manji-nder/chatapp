

function getrefral(req,res){

    res.render("getrefered",{email:req.user.emails[0].value})
}

module.exports={
    getrefral
}