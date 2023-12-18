<?php
// if ("0" === 0) {
//   // trusy
//   echo "true";
// } else {
//   // falsy
//   echo "false";
// }

// var_dump("0");
// var_dump(0);
// var_dump(0 == "0");

// $x = "";

// $x = "";
// echo gettype($x). "\n";
// echo empty($x) ? 'true' : 'false', "\n";
// echo is_null($x) ? 'true' : 'false', "\n";
// echo isset($x) ? 'true' : 'false', "\n";

// if($x){
//     echo 'true', "\n";
// } else {
//     echo 'false', "\n";
// }

// $x = null;
// echo gettype($x). "\n";
// echo empty($x) ? 'true' : 'false', "\n";
// echo is_null($x) ? 'true' : 'false', "\n";
// echo isset($x) ? 'true' : 'false', "\n";

// if($x){
//     echo 'true', "\n";
// } else {
//     echo 'false', "\n";
// }

// $x = "";
// var_dump($x);
// print_r($x);

// try {
//   // echo "ok";
// } catch (Exception) {
// }

// class Foo
// {
//   public $var = "valiable";
//   var $d = "dd";
//   public $f = "ff";
//   // function doFoo()
//   // {
//   //   print_r(__METHOD__);
//   // }
// }
// $bar = new Foo;
// var_dump($bar->d);
// var_dump($bar->f);

// // $bar->doFoo();
// // mrc_debug_print($bar);

// $x = [];
// echo gettype($x) . "\n";
// echo empty($x) ? 'true' : 'false', "\n";
// echo is_null($x) ? 'true' : 'false', "\n";
// echo isset($x) ? 'true' : 'false', "\n";

// $x = ['a', 'b'];
// echo gettype($x) . "\n";
// echo empty($x) ? 'true' : 'false', "\n";
// echo is_null($x) ? 'true' : 'false', "\n";
// echo isset($x) ? 'true' : 'false', "\n";


// $x = true;
// echo gettype($x) ? 'true' : 'false', "\n";
// echo empty($x) ? 'true' : 'false', "\n";
// echo is_null($x) ? 'true' :'false', "\n";
// echo isset($x) ? 'true' : 'false', "\n";

// $x = false;
// echo gettype($x) . "\n";
// echo empty($x) ? 'true' : 'false', "\n";
// echo is_null($x) ? 'true' : 'false', "\n";
// echo isset($x) ? 'true' : 'false', "\n";

// $x = 1;
// echo gettype($x)  . "\n";
// echo empty($x) ? 'true' : 'false', "\n";
// echo is_null($x) ? 'true' : 'false', "\n";
// echo isset($x) ? 'true' : 'false', "\n";


// $foo = '';              // 値'Bob'を$fooに代入する。
// $bar = &$foo;              // $fooを$barにより参照
// $bar = "My name is $bar";  // $barを変更...
// echo $bar;
// echo $foo;                 // $fooも変更される。

// $arr = ["tmp", "foo"];
// array_push($arr, "追加");
// var_dump($arr);

// $arr[] = "更に";
// var_dump($arr);

echo $_REQUEST["name"];
$str = implode("\n", $_REQUEST);
echo $str;
