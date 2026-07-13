async function analyser() {
    let critere = document.getElementById("critere").value;
    let cv = document.getElementById("cv").value;
    
    // Affiche le message de chargement
    document.getElementById("chargement").style.display = "block";
    document.getElementById("resultat").innerHTML = "";

    try {
        const response = await fetch("https://cv-ai-kohl.vercel.app/api/analyse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                critere: critere,
                cv: cv
            })
        });

        const resultat = await response.json();
        
        // Cache le message de chargement
        document.getElementById("chargement").style.display = "none";
        
        // Affiche le résultat ou l'erreur retournée par l'API
        if (resultat.reponse) {
            document.getElementById("resultat").innerHTML = resultat.reponse;
        } else if (resultat.error) {
            document.getElementById("resultat").innerHTML = "Erreur : " + resultat.error;
        }
        
    } catch (error) {
        document.getElementById("chargement").style.display = "none";
        document.getElementById("resultat").innerHTML = "Erreur de connexion avec le serveur.";
        console.error("Erreur détectée:", error);
    }
}
