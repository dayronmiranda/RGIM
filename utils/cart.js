// utils/cart.js
// Carrito con persistencia en sessionStorage

const CART_KEY = 'shopping_cart';

// Cargar carrito desde sessionStorage
function loadCartFromSession() {
  try {
    const cartData = sessionStorage.getItem(CART_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.warn('Error loading cart from session:', error);
    return [];
  }
}

// Guardar carrito en sessionStorage
function saveCartToSession(cart) {
  try {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn('Error saving cart to session:', error);
  }
}

// Inicializar carrito desde sessionStorage
let cart = loadCartFromSession();

export function addToCart(product) {
  const found = cart.find(item => item.id === product.id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCartToSession(cart);
}

export function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCartToSession(cart);
}

export function getCart() {
  // Siempre cargar desde sessionStorage para mantener sincronización
  cart = loadCartFromSession();
  return cart;
}

export function getCartTotal() {
  const currentCart = getCart();
  return currentCart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0);
}

export function clearCart() {
  cart = [];
  saveCartToSession(cart);
}

// Función para actualizar cantidad de un producto específico
export function updateProductQuantity(productId, newQuantity) {
  const currentCart = getCart();
  const item = currentCart.find(item => String(item.id) === String(productId));
  
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      item.qty = newQuantity;
      cart = currentCart;
      saveCartToSession(cart);
    }
  }
}

// Función para obtener la cantidad total de items
export function getCartItemCount() {
  const currentCart = getCart();
  return currentCart.reduce((sum, item) => sum + (item.qty || 0), 0);
}
