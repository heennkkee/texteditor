<?php

$dsn = 'sqlite:presentation.sqlite';
try {
    $db = new PDO($dsn);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {

}

$text = ($_POST['text']);
$sth = $db->prepare("DELETE FROM PRESENTATION");
$sth->execute();
$sth = $db->prepare("INSERT INTO PRESENTATION SELECT * FROM BACKUP");
$sth->execute();
 ?>
