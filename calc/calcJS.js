//Functions
function myClearFunction()
{
  document.getElementById("display").value=''; //Clears the answer textbox 
}
function btnBackspace()
{
  var ans = document.getElementById("display").value;
  var bs = ans.substring(0,(ans.length-1));
  document.getElementById("display").value = bs; 
}