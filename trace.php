<?php

require_once('common.php');

//check the request URL
if(!in_array($_SERVER['REMOTE_ADDR'],$config['allowed_sources']))
  throw new Exception("Request received from invalid source");

$dest = $_GET['dest'];

//make sure the dest is sanitized as an IP or domain using PHP filters
if(!filter_var(gethostbyname($dest),FILTER_VALIDATE_IP))
    throw new Exception("Invalid domain name or IP passed")

exec('sudo traceroute -w 1 -q 1 '.$dest,$output);
echo implode("\n",$output);