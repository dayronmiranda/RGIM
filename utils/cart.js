// utils/cart.js
// Carrito minimalista en memoria

let cart = [];

export function addToCart(product) {
  const found = cart.find(item => item.id === product.id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
}

export function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
}

export function getCart() {
  return cart;
}

export function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function clearCart() {
  cart = [];
}
