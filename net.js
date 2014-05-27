'use strict';

var async = require('async')
  , hostbyname = require('hostbyname')
  , dns = require('dns')
  , netPing = require('net-ping')

var nPs = netPing.createSession({
  networkProtocol: netPing.NetworkProtocol.IPv4,
  packetSize: 56,
  timeout: 1000
})

module.exports.ping = function(opts,cb){
  var pingData = {
    dest: opts.dest,
    ip: opts.dest,
    ptr: opts.dest,
    min: null,
    avg: null,
    max: null,
    mdev: 0
  }
  async.series([
      function(next){
        hostbyname.resolve(opts.dest,'v4',function(err,results){
          if(!err && results[0]) pingData.ip = results[0]
          next()
        })
      },
      function(next){
        dns.reverse(pingData.ip,function(err,results){
          if(!err && results[0]) pingData.ptr = results[0]
          next()
        })
      },
      function(next){
        async.timesSeries(opts.count || 1,
          function(seq,repeat){
            nPs.pingHost(pingData.ip,function(error,target,sent,received){
              var result = {
                error: error,
                target: target,
                sent: (sent) ? +sent : false,
                received: (received) ? +received : false,
                rtt: (received && sent) ? (received - sent) : false
              }
              if(result.rtt){
                if(null === pingData.min || result.rtt < pingData.min)
                  pingData.min = result.rtt
                if(null === pingData.max || result.rtt > pingData.max)
                  pingData.max = result.rtt
                pingData.avg =
                  (null === pingData.avg) ? result.rtt : (pingData.avg + result.rtt) / 2
              }
              setTimeout(function(){repeat(null,result)},1000)
            })
          },
          function(err,results){
            pingData.results = results
            next()
          }
        )
      }
    ],
    function(){
      cb(pingData)
    }
  )
}
