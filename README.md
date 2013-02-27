pingms-server
=============

The ping.ms server package which can be installed anywhere.

## Installing on CentOS 5
`wget -O - http://ping.ms/install_centos.sh | bash`

## Installing on CentOS 6
`wget -O - http://ping.ms/install_centos6.sh | bash`

## Installing on debian and others

Just clone the git repository and setup the script to work on port 4176.

It will need the following sudoers.d file

`apache ALL=(ALL) NOPASSWD:/bin/ping`

`apache ALL=(ALL) NOPASSWD:/bin/traceroute`

`apache ALL=(ALL) NOPASSWD:/opt/ping_server/update.sh`


Make sure to change apache to whatever user your webserver is using.

## Getting your server added to ping.ms

If you wish to contribute a location make sure and contact us: admins@esited.com

Make sure and tell us the following information:

* Your name
* Your website (for us to link to)
* Your company name
* Server IP
* Access to the server (this is optional)

Thanks
