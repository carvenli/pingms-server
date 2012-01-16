<?php

require_once('common.php');

$dest = $_GET['dest'];
exec('sudo traceroute -w 1 -q 1 '.$dest,$output);
echo implode("\n",$output);