<?php
$uri = $_SERVER['REQUEST_URI'];
$parts = explode('/', $uri);
$method = strtoupper($_SERVER["REQUEST_METHOD"]);  //メソッドをすべて大文字に
$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? "";
$area = $data['area'] ?? "";
$id = NUll;
header("Content-Type: application/json");
try {
  if (!(isset($parts[2]) && $parts[2] == "menu" || isset($parts[2]) && $parts[2] == "shop")) {
    throw new Exception("不正なURLです", 1);
  }
  if (isset($parts[3]) && is_numeric($parts[3])) {
    $parts = explode('/', $uri);
  } elseif (empty($parts[3])) {
    $parts = explode('/', $uri);
  } else {
    throw new Exception("不正なパラメーターです", 1);
  }
  if (isset($_REQUEST["id"])) {
    $id = $_REQUEST["id"];
  } else if (is_numeric(end($parts))) {
    $id = end($parts);
  }
  if (isset($parts[2])) {
    switch ($parts[2]) {
      case "menu":
        require "../classes/menuDB.php";
        $db = new MenuDB($id, $name);
        break;

      case "shop":
        require "../classes/shopDB.php";
        $db = new ShopDB($id, $name, $area);
        $db->area = $area;
        break;

      default:
        require "../classes/DB.php";
        $db = new DB($id, $name);
    }
    $db->id = $id;
    $db->name = $name;
    $db->connect();
  } else {
    throw new Exception("不正なURLです", 1);
  }



  $result = NULL;

  // $_SERVER['REQUEST_URI']
  // /api.php

  // $id = $_REQUEST["id"] ?? "";

  switch ($method) {
    case "DELETE":
      if (isset($parts[2])) {
        switch ($parts[2]) {
          case "menu":
            if ($id) {
              $sql = "DELETE FROM menu WHERE id = :id";
              $db->deleteone($sql, [':id' => $id]);
            }
            break;
          case "shop":
            if ($id) {
              $sql = "DELETE FROM shop WHERE id = :id";
              $db->deleteone($sql, [':id' => $id]);
            }
            break;
        }
        break;
      }
    case "GET":
      if (isset($parts[2])) {
        switch ($parts[2]) {
          case "menu":
            if ($id) {
              $sql = "SELECT * FROM menu WHERE id = :id";
              $result = $db->searchone($sql, [':id' => $id]);
            } else {
              $sql = "SELECT * FROM menu";
              $result = $db->searchall($sql);
            }
            break;
          case "shop":
            if ($id) {
              $sql = "SELECT * FROM shop WHERE id = :id";
              $result = $db->searchone($sql, [':id' => $id]);
            } else {
              $sql = "SELECT * FROM shop";
              $result = $db->searchall($sql);
            }
            break;
        }
        break;
      }

    case "POST":
      if (isset($parts[2]) && $parts[2] == "shop") {
        if (!isset($parts[3]) || empty($parts[3])) {
          $sql = "INSERT INTO shop (name, area) VALUES (:name, :area)";
          $db->prepare($sql);
          $db->bindNameArea(':name', $name, ':area', $area);
          $db->execute();
          $id = ($db->lastInsertId());
          $result = ["id" => $id, "name" => $name, "area" => $area];
          header("Content-Type: text/javascript; charset=utf-8");
          // echo json_encode($result);
        } else {
          throw new Exception("不正なURLです", 1);
        }
      } elseif (isset($parts[2]) && $parts[2] == "menu") {
        if (!isset($parts[3]) || empty($parts[3])) {
          $sql = "INSERT INTO menu (name) VALUES (:name)";
          $db->prepare($sql);
          $db->bindName(':name', $name);
          $db->execute();
          $id = ($db->lastInsertId());
          $result = ["id" => $id, "name" => $name];
          header("Content-Type: text/javascript; charset=utf-8");
          // echo json_encode($result);
        } else {
          throw new Exception("不正なURLです", 1);
        }
      }
      break;
    case "PUT":
      if (isset($parts[2])) {
        switch ($parts[2]) {
          case "menu":
            $sql = "UPDATE menu SET name=:name WHERE id = :id";
            $db->prepare($sql);
            $db->bind(':id', $id, ':name', $name);
            $db->execute();
            $result = ["id" => $id, "name" => $name];
            break;
          case "shop":
            $sql = "SELECT * FROM shop WHERE id = :id";
            $db->searchone($sql, [':id' => $id]);
            $sql = "UPDATE shop SET name=:name, area=:area WHERE id = :id";
            $db->prepare($sql);
            $db->bindAll(':id', $id, ':name', $name, 'area', $area);
            $db->execute();
            $result = ["id" => $id, "name" => $name, "area" => $area];
            break;
        }
      }
      break;

    default:
      throw new Exception("メソッドが不明です。", 1);
  }
  if ($result) {
    echo json_encode(["code" => 0, "data" => $result]);
  }
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
