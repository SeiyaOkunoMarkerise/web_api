<?php
// $age = 20;
// if ($age >= 18) {
//   echo "18歳です";
// }

// $age = 20;
// if ($age >= 18) {
//   echo "あなたは成人です";
// } else {
//   echo "あなたは未成年です";
// }

// $age = 10;
// if ($age >= 18) {
//   echo "あなたは成人です";
// } elseif ($age 6<,  < 18) {
//   echo "あなたは未成年です";
// } else {
//   echo "あなたは保育園児です";
// }

// $arr = array(1, 2, 3, 4);
// foreach ($arr as &$value) {
//   $value = $value * 2;
// }

// unset($value);

// print_r($arr);

// $a = array(1, 2, 3, 17);
// foreach ($a as $v) {
//   echo "現在のvalueは \$a: $v. \n";
// }

// print_r("$v");

// $a = array(
//   "one" => 1,
//   "two" => 2,
//   "three" => 3,
//   "seventeen" => 17
// );

// foreach ($a as $k => $v) {
//   echo "\$a[$k] => $v. \n";
// }

// $a = array();
// $a[0][0] = "a";
// $a[0][1] = "b";
// $a[1][0] = "y";
// $a[1][1] = "z";

// foreach ($a as $v1) {
//   foreach ($v1 as $v2) {
//     echo "$v2\n";
//   }
// }

$array = [
  [1, 2],
  [3, 4],
];

foreach ($array as list($a, $b)) {
  echo "A: $a; B: $b\n";
}

$arr = array(1, 2, 3, 4);


 puts $array[0]