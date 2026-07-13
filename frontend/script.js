async function analyser(){

let critere=document.getElementById("critere").value;

let cv=document.getElementById("cv").value;

document.getElementById("chargement").style.display="block";

const response=await fetch("http://localhost:3000/api/analyse",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

critere,

cv

})

});

const resultat=await response.json();

document.getElementById("chargement").style.display="none";

document.getElementById("resultat").innerHTML=resultat.reponse;

}