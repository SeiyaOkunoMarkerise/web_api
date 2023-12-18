<?php
require "../classes/DB.php";
header("Content-Type: application/json");
try {

  $method = strtoupper($_SERVER["REQUEST_METHOD"]);  //メソッドをすべて大文字に
  // GET, POST, PUT, DELETE
  // パラメータを受け取る

  $data = json_decode(file_get_contents('php://input'), true);
  $name = $data['name'] ?? "";
  $uri = $_SERVER['REQUEST_URI'];
  $parts = explode('/', $uri);

  // switch ($parts[2]) {
  //   case "menu":
  //     $pattern = '/^\/api\/api\/.php\/menu\/d+$';
  //     break;

  //   default:
  //     throw new Exception("無効なURLです", 1);
  // }
  // if (!preg_match($pattern, $uri)) {
  //   throw new Exception("無効なURLです", 1);
  // }
  $id = NUll;

  // $_SERVER['REQUEST_URI']
  // /api.php

  if (isset($_REQUEST["id"])) {
    $id = $_REQUEST["id"];
  } else if (is_numeric(end($parts))) {
    $id = end($parts);
  }
  // $id = $_REQUEST["id"] ?? "";
  $db = new DB();
  $db->id = $id;
  $db->name = $name;
  $db->connect();

  switch ($method) {
    case "DELETE":
      $sql = "DELETE FROM menu WHERE id = :id";
      $db->deleteone($sql, [':id' => $id]);

      break;
    case "GET":
      if ($id) {
        $sql = "SELECT * FROM menu WHERE id = :id";
        $result = $db->searchone($sql, [':id' => $id]);
      } else {
        $sql = "SELECT * FROM menu";
        $result = $db->searchall($sql);
      }
      break;
    case "POST":
      $sql = "INSERT INTO menu (name) VALUES (:name)";
      $db->prepare($sql);
      $db->bind(':name', $name);
      $db->execute();
      $ret = ["success" => "true", "name" => $name];
      header("Content-Type: text/javascript; charset=utf-8");
      echo json_encode($ret);
      break;
    case "PUT":
      $sql = "UPDATE menu SET name=:name WHERE id = :id";
      $db->prepare($sql);
      $db->bind(':name', $name);
      $db->execute();
      $ret = ["success" => "true", "name" => $name];
      header("Content-Type: text/javascript; charset=utf-8");
      echo json_encode($ret);
      break;
    default:
      throw new Exception("メソッドが不明です。", 1);
  }
  echo json_encode(["code" => 0, "data" => $result]);
  // if ($result !== null && isset($result["id"]) && isset($result["name"])) {
  // } else {
  //   echo json_encode("操作に失敗しました");
} catch (Exception $e) {
  echo json_encode(["code" => $e->getCode(), "error" => $e->getMessage()]);
}

        // if($result ?? ""){
          //   print_r($result['name']);
          // } else{
            //   echo "検索結果はありません";
            // };
            
            // header("Location: index.php");
            // mrc_debug_print($ret);
            // if(isset($_REQUEST(id,name)){
//   $_REQUEST["id"]
//   $_REQUEST["name"]
// };


// DBクラスをインスタンス化...execute()で実行

// $db = new DB;
// $db->execute();
