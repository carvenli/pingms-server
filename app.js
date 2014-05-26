'use strict';
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , config = require('./config')
  , ping = require('./ping')

app.use(express.urlencoded())

//main routes
var pingHandler = function(req,res){
  //check the request URL
  if(config.get('allowedSources').indexOf(req.ip) < 0){
    console.log('not-allowed from ' + req.ip)
    return res.end()
  }
  //check the given dest
  var dest = req.param('dest')
  if(!dest){
    console.log('dest not supplied')
    return res.end()
  }
  ping.ping(dest,function(rv){res.end(rv)})
  //    exec('ping ' + results[0],{timeout:4000},function(error,stdout){res.end(stdout)})
}

//routing
app.get('/ping',pingHandler)
app.get('/ping.php',pingHandler)

server.listen(config.get('listen.port'),config.get('listen.host'),function(err){
  if(err) return console.log(err)
  console.log('ping.ms server running on port ' + config.get('listen.port'))
})
