const mongoose = require('mongoose')

const express = require("express");
const exphbs = require("express-handlebars");
const app = express();

const User = require('./models/usersModel')

mongoose.connect('mongodb://127.0.0.1:27017/userman',()=>{ // this is used to connect the db
  console.log('connected to mongodb')
})

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoMethodsByDefault: true,
      allowProtoPropertiesByDefault: true,
    },
  })
);

app.set("view engine", ".hbs");


  

app.get("/", async (req,res) => {

const userFound =  await User.find()
const alluser = userFound.length


const prem =  await User.find({plan:'premium'})
const premuser = prem.length


const reg =  await User.find({plan:'regular'})
const reguser = reg.length


sum = 0
for(i=0;i<userFound.length;i++){
  sum = sum + userFound[i].fee
}
const totalrevenue= sum
res.render('index', {alluser,premuser,reguser,totalrevenue})

});

app.get("/all-users",async(req, res) => {
  const userFound =  await User.find()
  res.render("all-users",{userFound});
});


app.get("/add-users", async(req, res) => {
 
  res.render("add-users");
});

app.post('/add-users',async(req,res)=>{
  // const mybody = req.body
  
  const newUser = await User.create(
    {
    name:req.body.name,
    gender:req.body.gender,
    email:req.body.email,
    plan:req.body.plan,
   
  }
  )

  // Next Level Shit
  const userFound = await User.find();
  const allusers = userFound.length

  if( allusers == 1){
    newUser.nin = 1
  }
  else{
    newUser.nin = allusers 
  }
//Next Level Shit  


  if (newUser.plan == 'regular'){
   newUser.fee = 10000 
 }
 else if (newUser.plan == 'premium'){
 newUser.fee = 25000
 }
 newUser.view = 0
  newUser.save()
  res.redirect('/add-users')
})

//   // const mybody = req.body;
//   // mybody.id = jsdata.length + 1
//   // // console.log(mybody);

// if(mybody.plan =='regular'){
//   mybody.fee = 10000
// }
// else{
//   mybody.fee = 25000
// }



// mybody.views = 0;

//   jsdata.push(mybody)
//   const jsoned = JSON.stringify(jsdata)
//     fs.writeFileSync('data.json',jsoned)
//     res.redirect('/add-users')

//     // const newUser = {
//     //   name: req.body.name,
//     //   gender: req.body.gender,
//     //   email:,
//     //   plan:
//     // }
//     // if(newUse.plan === "regualr"){
//     //   newuser.fee = 1000
//     // }
//     // else if (newUse.plan === "regualr"){
//     //   newuser.fee = 25000


app.get('/edit/:nin', async (req, res, next)=> {
  
       await User.findById(req.params.nin, (err, user)=>{
            res.redirect('/edit-user')
       })
    });
 

// app.post('/edit-users',async (req,res)=>{
//   // const newHtml = jsdata.map(el => replacer(data, el)).join('');

//   // const allhtml = allUsersHtml.replace('{%tr%}', newHtml)
  
//   const viewKey = req.params.edit

//   console.log(viewKey)

//   const userFound = await User.find({email:viewKey})
//   const usersDetails = userFound[0]
//   const userUpdate =await User.update({ usersDetails})

  
//   res.re('/all-users',{userUpdate})
// })

// ------------------------------------------------------------------------

app.post('/update/:id', function(req, res, next) {

  //     }
      User.findByIdAndUpdate(req.body.id, {$set: req.body}, function(err, doc) { 
                res.redirect('/all-users')
      }); 
   })

 

// ------------------------------------------------------------------------------------

app.get("/premium-users", async (req, res) => {
// const allPrem = jsdata.filter(item => item.plan =='premium')

const allPrem = await User.find({plan:'premium'})
  res.render("premium-users",{allPrem});
}
);

app.get('/:email',(req,res)=>{
  
  const viewKey = req.params.email
   console.log(viewKey)

  //const userFound = jsdata.filter(item => item.id== viewKey )
  const userFound = User.find({email:viewKey})
  //   userFound[0].views++
  

  //  console.log(userFound)



  res.render('user-profile', {userFound})
  })

  app.get('/delete-user',(req,res)=>{
    
    const viewKey = req.params.email
    const userFound = User.find({email:viewkey});
   
    const userdelete = User.deleteOne({userFound})
  
    res.redirect('all-users',{userdelete})
    })
    
    

  app.get('/all-users/:id', function(req, res, next) {
    User.findByIdAndDelete(req.params.id, (err, doc) => {
        if (!err) { 
            res.redirect('/all-users');
        } else {
            console.log('Failed to Delete user Details: ' + err);
        }
    });
})

app.listen(2500, () => {
  console.log("Server us running on port 2500");
});