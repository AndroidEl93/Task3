<?php
    if (!isset($_GET['url'])) { header('HTTP/1.1 400 Bad Request'); }
    $url = $_GET['url'];
    $res = file_get_contents($url);
    if ($res != false) {
        header('Content-Type: application/json');
        exit($res);
    } else {
        header('HTTP/1.1 400 Bad Request');
    }
?>