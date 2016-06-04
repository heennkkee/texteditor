<?php

$dsn = 'sqlite:presentation.sqlite';
try {
    $db = new PDO($dsn);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {

}

$text = ($_POST['text']);
$sth = $db->prepare("UPDATE PRESENTATION SET TEXT = ?");
$sth->execute(array($text));

header('Content-type: application/json');
echo json_encode(array("output" => "saved data."));

 ?>
