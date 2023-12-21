<?php
require "DB.php";
class ShopDB extends DB
{
  public $area;

  public function __construct($id, $name, $area)
  {
    parent::__construct($id, $name);
    $this->area = $area;
  }

  public function bindAll()
  {
    parent::bind();
    $this->stmt->bindValue(':area', $this->area);
  }

  public function bindArea()
  {
    $this->stmt->bindValue(':area', $this->area);
  }
  public function bindNameArea()
  {
    $this->stmt->bindValue(':name', $this->name);
    $this->stmt->bindValue(':area', $this->area);
  }
}
