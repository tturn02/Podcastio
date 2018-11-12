

const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')

var express = require('express');
var router = express.Router();
const multer = require('multer')

//this string will take the transcribed data. There's gotta be a better way to get the data into the response.
var data = 'string'

//Config setup for Multer
const multerConfig = {
   storage: multer.diskStorage({
     destination: function(req, file, next){
       next(null, './public/audioFiles');
     },

     filename: function(req,file, next){
      const ext = file.mimetype.split('/')[1];
      next(null,file.fieldname + '-' +Date.now()+ '.' + ext);
    } 
   }),
   fileFilter: function(req, file, next){
     if(!file){
       next();
     }
     const audio = file.mimetype.startsWith('audio/');
     if(audio){
       next(null, true);
     } else {
       next({message: "File type not supported"}, false);
     }
   }
};

//Creates the audio file that is to be cliped
//ALso still need to give the user the ability to set the start and end time.
//Also ability to discern different speakers!
var createTestFile = function(name,startTime, EndTime){
  return new Promise((resolve) => {
  var command = ffmpeg('./public/audioFiles/'+name)
  var finalName = 'clipped'+name
  command.setStartTime(startTime).setDuration(EndTime).save('./public/audioFiles/postEdit/'+finalName)

  //Gotta find a way to stop with these timeouts. THey're trash and not reliable
  setTimeout(() => {
      resolve(finalName);
    }, 5000);
  })
}

var pipeReadStream = async function(stream,name){
  return new Promise((resolve) => {
    //pipe audio
    fs.createReadStream('./public/audioFiles/postEdit/'+name).pipe(stream)

    //listen for event
    stream.on('data', function(event) { data = event});
    stream.on('error', function(event) { console.log(event) });
    stream.on('close', function(event) { console.log("closed") });

    //This timeout is necessary to make sure the stream finishes before the response is given. There's definitely
    //Gotta be a better way to do this. Gotta look into this more
    setTimeout(() => {
    resolve("complete")
    },25000)
  })
}

//Too many fucking promises everywhere
var getTranslation =  function(name){
  return new Promise( async (resolve) => {

//Speech to Text credentials
var speechToText = new SpeechToTextV1({
  iam_apikey: '',
  url: 'https://stream.watsonplatform.net/speech-to-text/api'
})

//Speech to Text converter honestly needs better speech models so it can figure out what the fuck is going on
var params = {
  objectMode: true,
  content_type: 'audio/mp3',
  model: 'en-US_BroadbandModel',
  max_alternatives: 3,
};    
  // Create the stream.
  var recognizeStream = speechToText.recognizeUsingWebSocket(params);
  var final = await pipeReadStream(recognizeStream, name);

  resolve("complete")
  })
}

var onEvent = function(event){
  data = event;
}

var getText = function(name){ 
  return new Promise (async (resolve) =>{

  //The create Test file methhod needs work. Setting the start time works fine, but will have to figure out how the
  //Duration input is going to work. Is there anyway to get the length of the file beforehand?
  
  try{
    var result = await createTestFile(name,0,60)
    console.log('yep')
    var done = await getTranslation(result)
    resolve('complete')
    
  }catch(err){
    console.log(err)
  }
})
  
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/upload', multer(multerConfig).single('audio'), async function(req, res){
  if(req.file){
    var finished = await getText(req.file.filename)
    var finalizedData = JSON.stringify(data,null,2);
    res.send(finalizedData)
  }
  //if(req.file){
   // console.log(req.file)
    //req.body.audio = req.file.filename
  //}
})

module.exports = router;
