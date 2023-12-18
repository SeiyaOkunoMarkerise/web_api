<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <?php
  // try {
  //   // throw new Exception("エラーが出るよ");
  //   $pdo = new PDO('pgsql:host=db.com;dbname=postgres', 'postgres', 'postgres');
  //   var_dump("接続に成功しました");

  //   $sqlDrop = "DROP TABLE IF EXISTS menu;";
  //   $pdo->exec($sqlDrop);
  //   var_dump("既存のテーブルが削除されました（存在した場合）");

  //   $sqlCreate = "CREATE TABLE menu (
  //     id int PRIMARY KEY,
  //     name varchar(40)
  //   );";

  //   $res = $pdo->exec($sqlCreate);
  //   var_dump($res);
  //   echo "新しいメニューテーブルが作成されました" . PHP_EOL;

  //   $sqlInsert = "INSERT INTO menu (id, name) VALUES(1, 'Pizza') ";
  //   $pdo->exec($sqlInsert);

  //   $sqlSelect = "SELECT * FROM menu";
  //   $stmt = $pdo->query($sqlSelect);

  //   while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
  //     echo $row["name"] . PHP_EOL;
  //   }

  //   $sqlUpdate = "UPDATE menu SET name = 'Sushi' WHERE id =1";
  //   $res = $pdo->exec($sqlUpdate);
  //   var_dump($res);

  //   $sqlDelete = "DELETE FROM menu WHERE id = 1";
  //   $res = $pdo->exec($sqlDelete);
  //   var_dump($res);
  // } catch (PDOException $e) {
  //   print_r("PDO_error:" . PHP_EOL . $e->getMessage() . PHP_EOL);
  // } catch (Exception $e) {
  //   print_r($e->getMessage() . PHP_EOL);
  //   // print_r("error:" . PHP_EOL . $e->getMessage() . PHP_EOL);
  // }

  // try {
  //   // throw new Exception("エラーが出るよ");
  //   $pdo = new PDO('pgsql:host=db.com;dbname=postgres', 'postgres', 'postgres');
  //   var_dump("接続に成功しました");

  //   $sqlDrop = "DROP TABLE IF EXISTS menu;";
  //   $pdo->exec($sqlDrop);
  //   var_dump("既存のテーブルが削除されました（存在した場合）");

  //   $sqlCreate = "CREATE TABLE menu (
  //     id int PRIMARY KEY,
  //     name varchar(40)
  //   );";

  //   $res = $pdo->exec($sqlCreate);
  //   var_dump($res);
  //   echo "新しいメニューテーブルが作成されました" . PHP_EOL;

  //   $stmt = $pdo->prepare("INSERT INTO menu (id, name) VALUES(:id, :name) ");
  //   $id = 1;
  //   $name = 'Pizza';
  //   // $stmt->bindParam(':id', $id);
  //   // $stmt->bindParam(':name', $name);
  //   $stmt->bindValue(':id', $id);
  //   $stmt->bindValue(':name', $name);
  //   $stmt->execute();

  //   $sqlSelect = "SELECT * FROM menu";
  //   $stmt = $pdo->query($sqlSelect);

  //   // while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
  //   //   echo $row["name"] . PHP_EOL;
  //   // }
  //   foreach ($stmt as $k) {
  //     //   echo $row["name"] . PHP_EOL;
  //     print_r($k);
  //   }

  //   $sqlUpdate = "UPDATE menu SET name = 'Sushi' WHERE id =1";
  //   $res = $pdo->exec($sqlUpdate);
  //   var_dump($res);

  //   $sqlDelete = "DELETE FROM menu WHERE id = 1";
  //   $res = $pdo->exec($sqlDelete);
  //   var_dump($res);
  // } catch (PDOException $e) {
  //   print_r("PDO_error:" . PHP_EOL . $e->getMessage() . PHP_EOL);
  // } catch (Exception $e) {
  //   print_r($e->getMessage() . PHP_EOL);
  //   // print_r("error:" . PHP_EOL . $e->getMessage() . PHP_EOL);
  // }

  try {
    throw new Exception("エラーです！");
    $pdo = new PDO('pgsql:host=db.com;dbname=postgres', 'postgres', 'postgres');
    print_r("接続に成功しました");
    // $menu = $_POST['menu'];
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $menu = filter_input(INPUT_POST, 'menu', FILTER_SANITIZE_SPECIAL_CHARS);

    if ($id !== false && $menu !== false) {

      $stmt = $pdo->prepare("INSERT INTO menu (id, name) VALUES (:id, :name)");
      $stmt->bindParam(':id', $id);
      $stmt->bindParam(':name', $menu);
      $stmt->execute();
      echo "登録成功しました";
    }
  } catch (PDOException $e) {
    print_r("PDO_error:" . PHP_EOL . $e->getMessage() . PHP_EOL);
    // getMessageを使用して、PDOExceptionクラスから取り出す。
  } catch (Exception $e) {
    print_r("error:" . PHP_EOL . $e->getMessage() . PHP_EOL);
  }
  ?>
</body>

</html>