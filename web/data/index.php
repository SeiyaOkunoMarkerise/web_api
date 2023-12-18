<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="./view/lib/jquery-1.11.0.js"></script>
</head>

<body>
  <h1>index.php</h1>
  <h2><?php echo 'こんにちは'; ?></h2>
  <h2><?= 'この文字列を表示' ?></h2>
  <?php
  if ("0" === 0) {
    //  trusy
    echo "true";
  } else {
    // falsy
    echo "false";
  }
  ?>
</body>

</html>