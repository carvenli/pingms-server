<?php

$dest = $_GET['dest'];
exec('sudo ping -c 4 -W 1 '.$dest,$output);
echo implode("\n",$output);
