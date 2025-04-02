// Récupère la liste des produits depuis le fichier JSON
async function fetchProduits() {
  try {
    const response = await fetch('./public/liste_produits_quotidien.json');
    if (!response.ok) {
      throw new Error('Erreur de chargement du fichier JSON');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
}

// Récupère la liste des articles ajoutés depuis le localStorage
function getShoppingList() {
  return JSON.parse(localStorage.getItem('shoppingList')) || [];
}

// Calcule la quantité déjà ajoutée pour un produit donné (identifié par son nom)
function getPurchasedQuantity(productName) {
  const shoppingList = getShoppingList();
  return shoppingList.reduce((acc, item) => {
    if(item.nom === productName) {
      // Utilise la propriété quantite_achetee si définie, sinon considère 1
      return acc + (item.quantite_achetee ? parseInt(item.quantite_achetee, 10) : 1);
    }
    return acc;
  }, 0);
}

// Ajoute le produit à la liste de courses (localStorage) en mettant à jour la quantité s'il existe déjà
function addProductToShoppingList(produit) {
  const shoppingList = getShoppingList();
  const index = shoppingList.findIndex(item => item.nom === produit.nom);
  if(index >= 0) {
    // Si le produit existe déjà, incrémente la quantité, sans dépasser le stock total
    let currentQuantity = shoppingList[index].quantite_achetee ? parseInt(shoppingList[index].quantite_achetee, 10) : 1;
    if(currentQuantity < produit.quantite_stock) {
      shoppingList[index].quantite_achetee = currentQuantity + 1;
    } else {
      alert("Quantité maximum atteinte pour ce produit");
      return;
    }
  } else {
    shoppingList.push({
      ...produit,
      quantite_achetee: 1
    });
  }
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

// Rend la liste des produits en fonction d'un filtre (texte de recherche)
// On affiche uniquement les produits dont le stock restant (stock - quantité achetée) est > 0
function renderProducts(products, filter = '') {
  const produitsContainer = document.getElementById('produits');
  produitsContainer.innerHTML = '';
  
  // Filtre les produits selon le nom et le stock restant
  const filteredProducts = products.filter(produit => {
    // Filtre par nom (si un texte de recherche est saisi)
    if(filter && !produit.nom.toLowerCase().includes(filter.toLowerCase())) {
      return false;
    }
    const purchased = getPurchasedQuantity(produit.nom);
    const remaining = produit.quantite_stock - purchased;
    return remaining > 0;
  });

  if(filteredProducts.length === 0) {
    produitsContainer.textContent = 'Aucun produit disponible.';
    return;
  }

  filteredProducts.forEach(produit => {
    const purchased = getPurchasedQuantity(produit.nom);
    const remaining = produit.quantite_stock - purchased;
    
    // Création de la ligne pour le produit
    const row = document.createElement('div');
    row.className = "flex items-center justify-between bg-white border border-solid border-gray-200 rounded p-3";

    // Section d'information (nom, prix, et stock restant)
    const info = document.createElement('div');
    info.className = "flex flex-col sm:flex-row sm:space-x-4";

    const name = document.createElement('span');
    name.className = "font-semibold text-gray-800";
    name.textContent = produit.nom;

    const price = document.createElement('span');
    price.className = "text-gray-700";
    price.textContent = `${produit.prix_unitaire} €`;

    const stock = document.createElement('span');
    stock.className = "text-gray-600";
    stock.textContent = `Reste ${remaining} en stock`;

    info.appendChild(name);
    info.appendChild(price);
    info.appendChild(stock);

    // Bouton "Ajouter"
    const addButton = document.createElement('button');
    addButton.className = "bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded";
    addButton.textContent = "Ajouter";
    addButton.addEventListener('click', () => {
      addProductToShoppingList(produit);
      // Après ajout, on recalcule et on réaffiche la liste des produits
      renderProducts(products, document.getElementById('searchInput').value);
    });

    row.appendChild(info);
    row.appendChild(addButton);
    produitsContainer.appendChild(row);
  });
}

// Au chargement de la page, on récupère et on affiche les produits
document.addEventListener('DOMContentLoaded', async () => {
  const produits = await fetchProduits();

  // Ajoute l'événement de filtrage sur la barre de recherche
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    const filter = e.target.value;
    renderProducts(produits, filter);
  });

  renderProducts(produits);
});

// Export des fonctions pour les tests unitaires (si besoin)
export { renderProducts, addProductToShoppingList, getPurchasedQuantity, getShoppingList, fetchProduits };
