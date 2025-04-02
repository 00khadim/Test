// Fonction pour récupérer les produits depuis le fichier JSON
async function fetchProduits() {
  try {
    const response = await fetch('./public/liste_produits_quotidien.json');
    if (!response.ok) {
      throw new Error('Erreur de chargement du fichier JSON');
    }
    const produits = await response.json();
    return produits;
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const produits = await fetchProduits();
  const produitsContainer = document.getElementById('produits');

  if (produits.length > 0) {
    produits.forEach(produit => {
      // Création de la carte produit
      const card = document.createElement('div');
      card.className = "bg-white border border-gray-200 rounded p-4 shadow-sm flex flex-col";

      // Ligne supérieure : nom à gauche, prix à droite
      const topRow = document.createElement('div');
      topRow.className = "flex justify-between items-center mb-2";

      // Nom du produit (label)
      const name = document.createElement('span');
      name.className = "font-semibold text-gray-800";
      name.textContent = produit.nom;  // ex : "Pomme"

      // Prix du produit (en haut à droite)
      const price = document.createElement('span');
      price.className = "font-semibold text-gray-800";
      price.textContent = `${produit.prix_unitaire} €`;

      topRow.appendChild(name);
      topRow.appendChild(price);
      card.appendChild(topRow);

      // Stock
      const stock = document.createElement('p');
      stock.className = "text-sm text-gray-600 mb-4";
      stock.textContent = `Reste ${produit.quantite_stock} en stock`;
      card.appendChild(stock);

      // Bouton "Ajouter à la liste" (si nécessaire, ici un bouton standard)
      const addButton = document.createElement('button');
      addButton.className = "bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded";
      addButton.textContent = "Ajouter à la liste";
      card.appendChild(addButton);

      // Ajout de la carte au conteneur
      produitsContainer.appendChild(card);
    });
  } else {
    produitsContainer.textContent = 'Aucun produit disponible.';
  }
});
