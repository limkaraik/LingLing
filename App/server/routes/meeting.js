const express = require('express');
const router = express.Router();
const {User} = require('../models/User');
const {auth} = require('../middleware/auth')
const {Meeting} = require('../models/Meeting');
const {fileUpload} = require('../utils/fileUpload')

router.post('/getAll', auth, async (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let user = await User.findById(req.user._id)
    if (!user) return res.json({success:false,message:'User not found'})
    let meeting = user.meeting
    console.log(meeting)
    let findArgs = { _id:'',onGoing:false};
    let term = req.body.searchTerm;
    for (let key in req.body.filters) {
      if (key === 'date') {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
    let meetings = []
    for (const [key, value] of Object.entries(meeting)){
       
        findArgs['_id'] = key    
        try{
            if (term) {
                let m = await Meeting.find(findArgs)
                  .find({ $text: { $search: term } })
                  .sort([[sortBy, order]]);
                m.map((val,i)=>{
                  meetings.push(val)
                })
                
              } else {
                let m = await Meeting.find(findArgs)
                  .sort([[sortBy, order]])
                m.map((val,i)=>{
                  meetings.push(val)
                })
              }

        }catch(err){
            res.json({success:false,message:'fml'})
        }
        
    }
  
    res.json({meetings:meetings,success:true})
  });

//?name={name}
router.get('/enter',async (req,res)=>{
    let name = req.query.name
    const meeting = await Meeting.findOne({onGoing:true,name:name})
    if (!meeting){
        const m = new Meeting({name:name,numUsers:1})
        try{
            await m.save()
            res.status(200).json({success:true,id:m._id})
        } catch(err){
            res.json({success:false})
        }
    }
    else{
        try{
            await Meeting.findOneAndUpdate({onGoing:true,name:name},{numUsers: meeting.numUsers+1})
            res.status(200).json({success:true,id:meeting._id})
        }catch (err){
            res.json({success:false,message:err})
        }
    }
    
})

router.get('/exit',async(req,res)=>{
    let name = req.query.name
    const meeting = await Meeting.findOne({onGoing:true,name:name})
    if (meeting){
        let num = meeting.numUsers
        let og;
        if (num==1){
            og = false
        }else{og = true}
        try{
            await Meeting.findOneAndUpdate({onGoing:true,name:name},{onGoing:og,numUsers: num-1})
            res.status(200).json({success:true})
        }catch(err){
            res.json({success:false})
        }
    }
    else{
        res.json({success:false})
    }
    
})


router.post('/upload',auth,fileUpload,(req,res)=>{
  Meeting.findOneAndUpdate({_id:req.body.meetingId},{audio:req.files[0].path},(err,doc)=>{
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
      audio: req.files[0].path,
    });
  })
})

module.exports = router;