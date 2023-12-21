<?php
require "../classes/menuDB.php";
$name = "お試しアップデート";
$id = 10;
$db = new MenuDB($id, $name);
$db->id = $id;
$db->name = $name;
$db->connect();
if ($id) {
  $sql = "SELECT * FROM menu WHERE id = :id";

  $result = $db->searchone($sql, [':id' => $id]);
} else {
  $sql = "SELECT * FROM menu";
  $result = $db->searchall($sql);
}
// print_r($result);
header("Content-Type: text/javascript; charset=utf-8");
echo json_encode($result);
