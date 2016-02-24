<?php
$songId = $_GET['songId'];

$url = "http://music.moresub.co.uk/api/actions/9";
$content = '{"b":"track_selected","c":"' . $songId . '","d":2356}';

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-type: application/json"));
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $content);

echo curl_exec($curl);

http_response_code(curl_getinfo($curl, CURLINFO_HTTP_CODE));

curl_close($curl);
?>