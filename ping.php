<?php

require_once('common.php');

$dest = $_GET['dest'];

//make sure the dest is sanitized as an IP or domain using PHP filters
if(!filter_var(gethostbyname($dest),FILTER_VALIDATE_IP))
    throw new Exception("Invalid domain name or IP passed")
//actually make the ping request
exec('sudo ping -c 4 -W 1 '.$dest,$output);
echo implode("\n",$output);
