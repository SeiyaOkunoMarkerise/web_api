<!DOCTYPE html>
<html lang="js">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="./js/jquery-1.11.0.min.js"></script>
  <script src="./js/underscore.js"></script>
  <script src="./js/backbone.js"></script>
  <script src="./js/main.js"></script>
  <title>メニュー</title>
</head>

<body>
  <h1>食べ物のメニュー</h1>

  <div id="addMenu">
    <h3>食べ物のメニューを追加</h3>
    <input type="text" name="name" id="name" autocomplete="off" placeholder="Nameを入力">
    <input type="submit" value="追加">
  </div>

  <div id="searchMenu">
    <h3>IDからメニューを検索</h3>
    <input type="search" name="id" id="id" placeholder="IDを入力">
    <input type="submit" value="検索">
  </div>
  <div id="menus">

  </div>
  <script type="text/template" id="menu-template">
    ID: <%- id %>
    Name: <%- name %>
    <button class="edit">編集</button>
    <button class="delete">削除</button>
  </script>

  <script type="text/template" id="editMenu-template">
    <div>
      ID: <%- id %>
      Name: <input type="name" id="edit-name" value="<%- name %>">
    </div>
    <button class="save">保存</button>
    <button class="cancel">キャンセル</button>
</script>
</body>

</html>