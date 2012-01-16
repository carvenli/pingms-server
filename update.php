<?php

//this php script will trigger an update of the client script

exec("sudo /opt/ping_server/update.sh",$output);
echo implode("\n",$output)."\n";

