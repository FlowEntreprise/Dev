// var i = 0;
// var original = document.getElementsByClassName('flow2')[0];
// console.log(original);
 function duplicates() {
var div_test = document.createElement('div');
div_test.id = 'id_div_test';
div_test.className = 'class_div_test';
div_test.style.width ='90vw';
div_test.style.height ='15vh';
div_test.style.backgroundColor = 'purple';
document.getElementById('tab2').appendChild(div_test);
var paragraphe = document.createElement('p');
paragraphe.width = '40vw';
paragraphe.backgroundColor ='red';
paragraphe.innerText = 'bonjour moi ';
div_test.appendChild(paragraphe);
 }


 function Block () {
    this.index = 0;
    this.name;
    this.playBtn
    
    this.blockElement

    this.Play = function () {
        console.log("id : "+this.index+" name : "+this.name);
    }
}

var myblock = new Block();
myblock.index = 99;
myblock.name = "Salut salut";
myblock.Play();
