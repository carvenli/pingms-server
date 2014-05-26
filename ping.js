var async = require('async')
  , hostbyname = require('hostbyname')
  , netPing = require('net-ping')

var nPs = netPing.createSession({
  networkProtocol: netPing.NetworkProtocol.IPv4,
  packetSize: 56,
  timeout: 1000
})

module.exports.ping = function(dest,cb){
  var ip = dest, ptr = dest
  var p = [], startTime
  var xmit = 0, recv = 0
  var min = null, avg = null, max = null, mdev = 0
  async.eachSeries([0,1,2,3,4],
    function(seq,next){
      if(seq === 0){
        hostbyname.resolve(dest,'v4',function(err,results){
          if(err || !results[0]) cb('resolve failed')
          ip = results[0]
          startTime = +(new Date)
          next()
        })
      } else {
        nPs.pingHost(ip,function(error,target,sent,rcvd){
          xmit++
          if(error){
            p[seq] = null
          } else {
            recv++
            p[seq] = rcvd - sent
            if(null === min || p[seq] < min) min = p[seq]
            if(null === max || p[seq] > max) max = p[seq]
            if(null === avg) avg = p[seq]
            else avg = (avg + p[seq]) / 2
          }
          setTimeout(next,1000)
        })
      }
    },
    function(err){
      if(err) console.log(err)
      else {
        var rv = []
//PING google.com (74.125.225.160) 56(84) bytes of data.
        rv.push('PING ' + dest + ' (' + ip + ') 56(84) bytes of data.')
        async.eachSeries([1,2,3,4],
          function(seq,next){
//64 bytes from den03s05-in-f0.1e100.net (74.125.225.160): icmp_seq=1 ttl=52 time=47.8 ms
            if(null !== p[seq])
              rv.push('64 bytes from ' + ptr + ' (' + ip + '): icmp_seq=' + seq + ' ttl=52 time=' + p[seq].toFixed(1) + ' ms')
            next()
          },
          function(err){
            if(err) console.log(err)
          }
        )
//
        rv.push('')
//--- google.com ping statistics ---
        rv.push('--- ' + dest + ' ping statistics ---')
//4 packets transmitted, 4 received, 0% packet loss, time 3004ms
        var pktloss = ((1 - (recv / xmit)) * 100).toFixed(0)
        var elapsed = (((new Date) - startTime)).toFixed(0)
        rv.push(xmit + ' packets transmitted, ' + recv + ' received, ' + pktloss + '% packet loss, time ' + elapsed + 'ms')
//rtt min/avg/max/mdev = 47.803/47.894/48.145/0.262 ms
        rv.push('rtt min/avg/max/mdev = ' + min.toFixed(3) + '/' + avg.toFixed(3) + '/' + max.toFixed(3) + '/' + mdev.toFixed(3) + ' ms')
        cb(rv.join('\n'))
      }
    }
  )
}
