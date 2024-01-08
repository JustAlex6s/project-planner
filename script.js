function ajouterTache() {
    const nomTache = document.getElementById('nomTache').value;
    const descriptionTache = document.getElementById('descriptionTache').value;
    const dateEcheance = document.getElementById('dateEcheance').value;

    // Valider les données
    if (!nomTache || !dateEcheance) {
        alert("Le nom de la tâche et la date d'échéance sont requis !");
        return;
    }

    // Générer un identifiant unique
    const idTache = new Date().getTime();

    // Définir le statut par défaut et la date de création
    const statutTache = 'à faire';
    const dateCreation = new Date().toISOString();

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

// Fonction pour mettre à jour la liste des tâches
function mettreAJourListeTaches() {
    const listeTachesElement = document.getElementById('liste-taches');
    listeTachesElement.innerHTML = '';
taches.forEach(tache => {
        const elementTache = document.createElement('div');
        elementTache.innerHTML = 
        ` <p>ID : ${tache.id}</p>
            <p>Nom : ${tache.nom}</p>
            <p>Description : ${tache.description || 'N/A'}</p>
            <p>Statut : ${tache.statut}</p>
            <p>Date de Création : ${tache.dateCreation}</p>
            <p>Date d'Échéance : ${tache.dateEcheance}</p>
            <button onclick="mettreAJourTache(${tache.id})">Mettre à Jour</button>
            <button onclick="supprimerTache(${tache.id})">Supprimer</button>
            ` ;
        listeTachesElement.appendChild(elementTache);
    });
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
