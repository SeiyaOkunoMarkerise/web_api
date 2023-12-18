<?php
require "../classes/DB.php";
$name = "お試しアップデート";
$id = 10;
$db = new DB();
$db->id = $id;
$db->name = $name;
$db->connect();
$sql = "UPDATE menu SET name=:name WHERE id = :id";
$db->prepare($sql);
$db->bind(':name', $name);
$db->execute();
$ret = ["success" => "true", "name" => $name];
print_r($ret);
header("Content-Type: text/javascript; charset=utf-8");
echo json_encode($ret);
  