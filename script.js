function ajouterTache() {
    const nomTache = document.getElementById('nomTache').value;
    const descriptionTache = document.getElementById('descriptionTache').value;
    const dateEcheance = document.getElementById('dateEcheance').value;

    // Valider les données
    if (!nomTache || !dateEcheance) {
        alert("Le nom de la tâche et la date d'échéance sont requis !");
        return;
    }
     // Valider la longueur du nom de la tâche
     if (nomTache.length < 3 || nomTache.length > 256) {
        alert("Le nom de la tâche doit contenir entre 3 et 256 caractères.");
        return;
    }

    // Valider la longueur de la description de la tâche
    if (descriptionTache.length < 5 || descriptionTache.length > 1024) {
        alert("La description de la tâche doit contenir entre 5 et 1024 caractères.");
        return;
    }

    // Générer un identifiant unique
    const idTache = new Date().getTime();

    // Définir le statut par défaut et la date de création
    const statutTache = 'à faire';
    const dateCreation = new Date().toLocaleString('en-US', { timeZone: 'Europe/Brussels', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false  });

    // Créer l'objet tâche
    const tache = {
        id: idTache,
        nom: nomTache,
        description: descriptionTache,
        statut: statutTache,
        dateCreation: dateCreation,
        dateEcheance: dateEcheance
    };

    // Ajouter la tâche à la liste
    taches.push(tache);

    // Mettre à jour la liste des tâches affichée
    mettreAJourListeTaches();

    // Réinitialiser les champs du formulaire
    document.getElementById('nomTache').value = '';
    document.getElementById('descriptionTache').value = '';
    document.getElementById('dateEcheance').value = '';
}

function calculerTempsRestant(dateCreation, dateEcheance) {
    const dateCreationObj = new Date(dateCreation);
    const dateEcheanceObj = new Date(dateEcheance);
    
    const differenceEnMillisecondes = dateCreationObj - dateEcheanceObj ;
    const differenceEnJours = Math.floor(differenceEnMillisecondes / (1000 * 60 * 60 * 24));

    return differenceEnJours;
}

// Fonction pour mettre à jour la liste des tâches en fonction du statut
function mettreAJourListeTaches(statutFiltre) {
    const listeTachesElement = document.getElementById('liste-taches');
    listeTachesElement.innerHTML = '';

    const tachesAffichees = statutFiltre
        ? taches.filter(tache => tache.statut === statutFiltre)
        : taches;

    tachesAffichees.forEach(tache => {
        const elementTache = document.createElement('div');
        const tempsRestant = calculerTempsRestant(tache.dateCreation, tache.dateEcheance);
        elementTache.innerHTML = 
        ` 
            <p>Nom : ${tache.nom}</p>
            <p>Description : ${tache.description || 'N/A'}</p>
            <p>Statut : ${tache.statut}</p>
            <p>Date de Création : ${tache.dateCreation}</p>
            <p>Date d'Échéance : ${tache.dateEcheance}</p>
            <p>Temps restant: ${tempsRestant} jour(s)</p>
            <button onclick="mettreAJourTache(${tache.id})">Mettre à Jour</button>
            <button onclick="supprimerTache(${tache.id})">Supprimer</button>
        ` ;

        listeTachesElement.appendChild(elementTache);
    });
}

// Fonction pour filtrer les tâches par statut
function filtrerTaches(statut) {
    mettreAJourListeTaches(statut);
}

// Fonction pour afficher toutes les tâches
function afficherToutesTaches() {
    mettreAJourListeTaches();
}


// Fonction pour mettre à jour le statut d'une tâche
function mettreAJourTache(id) {
    // Trouver la tâche par ID
    const tache = taches.find(tache => tache.id === id);

    // Mettre à jour le statut de la tâche
    if (tache) {
        const nouveauStatut = prompt('Entrez le nouveau statut (à faire, en cours, terminé) :');
        if (nouveauStatut && ['à faire', 'en cours', 'terminé'].includes(nouveauStatut.toLowerCase())) {
            tache.statut = nouveauStatut.toLowerCase();
            mettreAJourListeTaches();
        } else {
            alert('Statut invalide saisi.');
        }
    } else {
        alert('Tâche non trouvée.');
    }
}

// Fonction pour supprimer une tâche
function supprimerTache(id) {
    // Trouver l'index de la tâche par ID
    const index = taches.findIndex(tache => tache.id === id);

    // Supprimer la tâche de la liste
    if (index !== -1) {
        taches.splice(index, 1);
        mettreAJourListeTaches();
    } else {
        alert('Tâche non trouvée.');
    }
}
// Fonction pour trier les tâches
function trierTaches() {
    const critereTri = document.getElementById('triTaches').value;

    if (critereTri === 'tempsRestant') {
        taches.sort((a, b) => {
            const tempsRestantA = calculerTempsRestant(a.dateCreation, a.dateEcheance);
            const tempsRestantB = calculerTempsRestant(b.dateCreation, b.dateEcheance);
            return tempsRestantB - tempsRestantA; // Inversion ici pour trier du plus grand au plus petit
        });
    } else if (critereTri === 'nom') {
        taches.sort((a, b) => a.nom.localeCompare(b.nom));
    }

    mettreAJourListeTaches();
}

// Tableau de tâches pour stocker les tâches
let taches = [];

// Charger les tâches depuis LocalStorage si disponible
if (localStorage.getItem('taches')) {
    taches = JSON.parse(localStorage.getItem('taches'));
    mettreAJourListeTaches();
}

// Enregistrer les tâches dans LocalStorage lors du déchargement de la page
window.addEventListener('unload', () => {
    localStorage.setItem('taches', JSON.stringify(taches));
});
