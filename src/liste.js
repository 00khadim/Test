// Récupère la liste de courses depuis le localStorage (ou initialise un tableau vide)
function getShoppingList() {
  return JSON.parse(localStorage.getItem('shoppingList')) || [];
}

// Sauvegarde la liste de courses dans le localStorage
function setShoppingList(list) {
  localStorage.setItem('shoppingList', JSON.stringify(list));
}

// Calcule le total général de la liste
function calculateTotal(list) {
  return list.reduce((acc, item) => {
    const quantity = parseInt(item.quantite_achetee, 10) || 1;
    return acc + item.prix_unitaire * quantity;
  }, 0);
}

// Rendu du tableau de la liste de courses
function renderCourseList() {
  const shoppingList = getShoppingList();
  const tbody = document.getElementById('liste-course-body');
  tbody.innerHTML = ''; // On vide le contenu précédent

  shoppingList.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.className = "text-center";

    // Colonne Produit
    const tdProduit = document.createElement('td');
    tdProduit.className = "py-2 px-4 border";
    tdProduit.textContent = item.nom;
    tr.appendChild(tdProduit);

    // Colonne Prix unitaire
    const tdPU = document.createElement('td');
    tdPU.className = "py-2 px-4 border";
    tdPU.textContent = item.prix_unitaire.toFixed(2);
    tr.appendChild(tdPU);

    // Colonne Quantité avec input
    const tdQuantite = document.createElement('td');
    tdQuantite.className = "py-2 px-4 border";
    const inputQuantite = document.createElement('input');
    inputQuantite.type = "number";
    inputQuantite.min = "1";
    inputQuantite.value = item.quantite_achetee || 1;
    inputQuantite.className = "w-16 border border-gray-300 rounded p-1";
    inputQuantite.setAttribute("data-index", index);
    inputQuantite.addEventListener('change', (e) => {
      const newQty = parseInt(e.target.value, 10);
      if (newQty < 1) {
        e.target.value = 1;
        return;
      }
      shoppingList[index].quantite_achetee = newQty;
      setShoppingList(shoppingList);
      renderCourseList();
    });
    tdQuantite.appendChild(inputQuantite);
    tr.appendChild(tdQuantite);

    // Colonne Sous-total
    const tdSousTotal = document.createElement('td');
    tdSousTotal.className = "py-2 px-4 border";
    const sousTotal = item.prix_unitaire * (parseInt(item.quantite_achetee, 10) || 1);
    tdSousTotal.textContent = sousTotal.toFixed(2);
    tr.appendChild(tdSousTotal);

    // Colonne Action avec bouton Supprimer
    const tdAction = document.createElement('td');
    tdAction.className = "py-2 px-4 border";
    const btnSupprimer = document.createElement('button');
    btnSupprimer.textContent = "Supprimer";
    btnSupprimer.setAttribute("data-delete", index);
    btnSupprimer.className = "bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded";
    btnSupprimer.addEventListener('click', () => {
      shoppingList.splice(index, 1);
      setShoppingList(shoppingList);
      renderCourseList();
    });
    tdAction.appendChild(btnSupprimer);
    tr.appendChild(tdAction);

    tbody.appendChild(tr);
  });

  // Mise à jour du total général
  const total = calculateTotal(shoppingList);
  document.getElementById('total-general').textContent = `Total: ${total.toFixed(2)} €`;
}

// Gestion du bouton "Vider la liste"
document.getElementById('vider-liste').addEventListener('click', () => {
  if (confirm("Voulez-vous vraiment vider la liste de courses ?")) {
    setShoppingList([]);
    renderCourseList();
  }
});

// Initialisation du rendu lors du chargement de la page
document.addEventListener('DOMContentLoaded', renderCourseList);

// Export des fonctions pour faciliter les tests unitaires, si nécessaire
export { getShoppingList, setShoppingList, calculateTotal, renderCourseList };
