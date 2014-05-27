'use strict';
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , config = require('./config')
  , net = require('./net')
  , compat = require('./compat')

app.use(express.urlencoded())

//main route handlers
var pingHandler = function(req,res,compatible){
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
  net.ping({dest:dest,count:4},function(rv){
    res.end((true !== compatible) ? JSON.stringify(rv) : compat.pingFormat(rv))
  })
}
var traceHandler = function(req,res,compatible){
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
  net.trace({dest:dest},function(rv){
    res.end((true !== compatible) ? JSON.stringify(rv) : compat.traceFormat(rv))
  })
}

//routing
app.get('/ping',pingHandler)
app.get('/trace',traceHandler)

//legacy formatted routes
app.get('/ping.php',function(req,res){pingHandler(req,res,true)})
app.get('/trace.php',function(req,res){traceHandler(req,res,true)})

server.listen(config.get('listen.port'),config.get('listen.host'),function(err){
  if(err) return console.log(err)
  console.log('ping.ms server running on port ' + config.get('listen.port'))
})
