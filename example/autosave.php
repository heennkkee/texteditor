<?php
session_name(preg_replace('/[^a-z\d]/i', '', __DIR__));
session_start();

$do = isset($_POST['do']) ? $_POST['do'] : null;

if ($do == 'save') {
    $_SESSION['editor-save'] = html_entity_decode($_POST['text']);
    $output = '';
} elseif ($do == 'load') {
    $output = isset($_SESSION['editor-save']) ? $_SESSION['editor-save'] : '';
} elseif ($do == 'clear') {
    unset($_SESSION['editor-save']);
    $output = 'Cleared session.';
}

header('Content-type: application/json');
echo json_encode(array("output" => $output));
