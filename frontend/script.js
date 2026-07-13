// Fonction utilitaire pour convertir un fichier en Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // On extrait uniquement les données brutes après la virgule
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
}

async function analyser() {
    let critere = document.getElementById("critere").value;
    let fileInput = document.getElementById("cvFile");
    
    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Veuillez sélectionner un fichier de CV avant de lancer l'analyse.");
        return;
    }

    let file = fileInput.files[0];
    
    // Affiche le chargement
    document.getElementById("chargement").style.display = "block";
    document.getElementById("resultat").innerHTML = "";

    try {
        // Conversion du fichier choisi en texte Base64
        const fileBase64 = await fileToBase64(file);

        const response = await fetch("https://cv-ai-kohl.vercel.app/api/analyse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                critere: critere,
                fileData: fileBase64,
                mimeType: file.type // Donne le type de fichier (application/pdf, etc.)
            })
        });

        const resultat = await response.json();
        
        document.getElementById("chargement").style.display = "none";
        
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
