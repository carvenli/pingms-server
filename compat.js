'use strict';
var async = require('async')

module.exports.pingFormat = function(pingData){
  var rv = []
    , requests = pingData.results.length
    , replies = 0
    , timeStart = null
    , timeEnd = null
  //PING google.com (74.125.225.160) 56(84) bytes of data.
  rv.push('PING ' + pingData.dest + ' (' + pingData.ip + ') 56(84) bytes of data.')
  async.timesSeries(requests - 1,
    function(seq,next){
      var result = pingData.results[seq]
      //64 bytes from den03s05-in-f0.1e100.net (74.125.225.160): icmp_seq=1 ttl=52 time=47.8 ms
      if(null !== result.rtt){
        rv.push('64 bytes from ' + pingData.ptr + ' (' + pingData.ip + '):' + ' icmp_seq=' + (seq + 1).toFixed(0) + ' ttl=128' + ' time=' + result.rtt.toFixed(1) + ' ms')
        replies++
        if(null === timeStart) timeStart = result.sent
        timeEnd = result.received
      }
      next()
    }
  )
  //
  rv.push('')
  //--- google.com ping statistics ---
  rv.push('--- ' + pingData.dest + ' ping statistics ---')
  //4 packets transmitted, 4 received, 0% packet loss, time 3004ms
  var pktloss = ((1 - (replies / requests)) * 100).toFixed(0)
  var elapsed = ((timeEnd - timeStart)).toFixed(0)
  rv.push(requests + ' packets transmitted, ' + replies + ' received, ' + pktloss + '% packet loss, time ' + elapsed + 'ms')
  //rtt min/avg/max/mdev = 47.803/47.894/48.145/0.262 ms
  rv.push('rtt min/avg/max/mdev = ' + pingData.min.toFixed(3) + '/' + pingData.avg.toFixed(3) + '/' + pingData.max.toFixed(3) + '/' + pingData.mdev.toFixed(3) + ' ms')
  return(rv.join('\n'))
}

module.exports.traceFormat = function(traceData){
  var rv = []
  return(rv.join('\n'))
}