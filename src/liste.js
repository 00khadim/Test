// Récupère la liste du panier depuis le localStorage (ou retourne un tableau vide)
export const getShoppingList = () =>
  JSON.parse(localStorage.getItem('shoppingList')) || [];

// Sauvegarde la liste dans le localStorage
export const setShoppingList = (list) =>
  localStorage.setItem('shoppingList', JSON.stringify(list));

// Calcule le total général de la liste
export const calculateTotal = (list) =>
  list.reduce(
    (total, item) =>
      total + item.prix_unitaire * (parseInt(item.quantite_achetee, 10) || 1),
    0
  );

// Génère le markup HTML pour le tableau de la liste de courses
export const renderCourseList = () => {
  const shoppingList = getShoppingList();
  const tbody = document.getElementById('liste-course-body');

  tbody.innerHTML = shoppingList
    .map((item, index) => {
      const qty = parseInt(item.quantite_achetee, 10) || 1;
      const sousTotal = item.prix_unitaire * qty;
      return `
        <tr class="text-center">
          <td class="py-2 px-4 border">${item.nom}</td>
          <td class="py-2 px-4 border">${item.prix_unitaire.toFixed(2)}</td>
          <td class="py-2 px-4 border">
            <input type="number" data-index="${index}" value="${qty}" min="1" class="w-16 border border-gray-300 rounded p-1"/>
          </td>
          <td class="py-2 px-4 border">${sousTotal.toFixed(2)}</td>
          <td class="py-2 px-4 border">
            <button data-delete="${index}" class="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">Supprimer</button>
          </td>
        </tr>
      `;
    })
    .join('');

  document.getElementById('total-general').textContent =
    "Total: " + calculateTotal(shoppingList).toFixed(2) + " €";
};

// Lie les événements du tableau via la délégation
export const bindCourseListEvents = () => {
  const tbody = document.getElementById('liste-course-body');

  // Gestion de la modification de quantité
  tbody.addEventListener('change', (e) => {
    if (e.target.matches('input[type="number"]')) {
      const index = parseInt(e.target.getAttribute('data-index'), 10);
      const newQty = parseInt(e.target.value, 10);
      if (newQty < 1) {
        e.target.value = 1;
        return;
      }
      const list = getShoppingList();
      list[index].quantite_achetee = newQty;
      setShoppingList(list);
      renderCourseList();
    }
  });

  // Gestion du clic sur le bouton Supprimer
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-delete]');
    if (btn) {
      const index = parseInt(btn.getAttribute('data-delete'), 10);
      const list = getShoppingList();
      list.splice(index, 1);
      setShoppingList(list);
      renderCourseList();
    }
  });

  // Bouton pour vider la liste
  document.getElementById('vider-liste').addEventListener('click', () => {
    if (confirm("Voulez-vous vraiment vider la liste de courses ?")) {
      setShoppingList([]);
      renderCourseList();
    }
  });
};

// Initialisation lors du chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  renderCourseList();
  bindCourseListEvents();
});
