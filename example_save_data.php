<?php

$dsn = 'sqlite:testdata/testData.sqlite';
try {
    $db = new PDO($dsn);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {

}

$text = htmlspecialchars_decode($_POST['text']);
$id = $_POST['id'];
$sth = $db->prepare("UPDATE POSTS SET TEXT = '" . $text . "' WHERE ID = " . $id);
$sth->execute();

header('Content-type: application/json');
echo json_encode(array("output" => "saved data."));

 ?>
