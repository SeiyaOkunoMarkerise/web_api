<?php
function mrc_debug_print($o)
{
  $fp = fopen("/var/www/data/tmp/debug.txt", "a");
  fwrite($fp, "-------------------------------\n");
  fwrite($fp, print_r($o, TRUE) . "\n");
  fclose($fp);
}
