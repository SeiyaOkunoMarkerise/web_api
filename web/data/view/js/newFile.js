// alert("入力値が違います");
// a = fetch("https://jsonplaceholder.typicode.com/photos");
// console.log(a);
// fetch('https://jsonplaceholder.typicode.com/photos')
// .then((response)=>{
//   if(!response.ok){
//     throw new Error();
//   }
//   return response.json();//あるいは response.json()
// })
// .then((response)=>{
// console.log(response);
// })
// .catch((reason)=>{
//エラー
// });
// alert("fetchができています");
$(function () {
  var SampleView = Backbone.View.extend({});

  var sampleView = new SampleView();
  $('body').append(sampleView.el);
});
