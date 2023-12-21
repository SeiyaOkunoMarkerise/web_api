<?php
require "error.php";
class DB
{
  // 定数: 接続情報 
  const DB_NAME = "postgres";
  const DB_USER = "postgres";
  const DB_HOST = "db.com";
  const DB_PASSWORD = "postgres";

  // パラメータを初期化してください
  protected $data;
  protected $pdo;
  protected $stmt;
  public $id;
  public $name;  //メンバー変数ともいう

  // メソッド: コンストラクタ(パラメータ id,nameをセット)
  public function __construct($id, $name)
  {
    $this->id = $id;
    $this->name = $name;
  }

  // メソッド: connect()(PDOで接続)
  public function connect()
  {
    //! つまづき：定数の参照で、PDOでDBに接続するにはどの情報が必要か、わからず苦労した。
    //? KEEP:変数を用いて、PDO接続のコードを書くことができた。
    $this->pdo = new PDO("pgsql:host=" . self::DB_HOST . ";dbname=" . self::DB_NAME, self::DB_USER, self::DB_PASSWORD, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    // $this->pdo = new PDO(定数の参照)

    // $pdo = new PDO('pgsql:host=db.com;dbname=postgres', 'postgres', 'postgres');
    // new PDO("pgsql:host=" . self::DB_HOST . ";dbname=" . self::)
  }

  // メソッド: prepare()(prepare())
  public function prepare($sql)
  {
    // $this->stmt = $this->pdo->prepare("INSERT INTO menu (id, name) VALUES (:id, :name)");
    $this->stmt = $this->pdo->prepare($sql);
  }

  // メソッド: bind()(セットされたパラメータをbindValue())
  // $this->stmt = $this->pdo->prepare()
  public function bind()
  {
    $this->stmt->bindValue(':id', $this->id);
    $this->stmt->bindValue(':name', $this->name);
  }

  public function bindName()
  {
    $this->stmt->bindValue(':name', $this->name);
  }
  // メソッド: execute()(クエリ実行)
  // $this->stmt->execute();
  public function execute()
  {
    $this->stmt->execute();
  }

  public function searchone($sql)
  {
    $this->stmt = $this->pdo->prepare($sql);
    $this->stmt->bindValue(':id', $this->id);
    $this->stmt->execute();
    $result = $this->stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
      return $result;
    } else {
      throw new Exception("検索IDは存在しません", 1);
    }
    // mrc_debug_print($this->stmt);
  }

  public function searchall($sql)
  {
    $this->stmt = $this->pdo->prepare($sql);
    $this->stmt->execute();
    $result = $this->stmt->fetchall(PDO::FETCH_ASSOC);
    return $result;
  }

  // DELETEメソッド
  public function deleteone($sql)
  {
    $this->stmt = $this->pdo->prepare($sql);
    // mrc_debug_print($sql);
    $this->stmt->bindValue(':id', $this->id, PDO::PARAM_INT);
    $this->stmt->execute();
  }


  // EDITメソッド
  public function editone($sql)
  {
    $this->stmt = $this->pdo->prepare($sql);
    $this->stmt->bindValue(':id', $this->id);
    $this->stmt->bindValue(':name', $this->name);
    $this->stmt->execute();
  }

  public function fetchone()
  {
    $this->stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function lastInsertId()
  {
    return $this->pdo->lastInsertId();
  }
  public function updateone() {

  }

}
