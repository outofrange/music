<?php
header("Cache-Control: max-age=2592000"); //30days (60sec * 60min * 24hours * 30days)
echo file_get_contents("http://music.moresub.co.uk/api/tracks");
?>