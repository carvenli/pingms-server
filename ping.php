<?php

$dest = $_GET['dest'];
exec('sudo ping -w 3 -W 1 '.$dest,$output);
echo implode("\n",$output);