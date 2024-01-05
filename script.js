

let cart = [];

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', (event) => {
    const button = event.target;
    const productId = button.getAttribute('data-product-id');
    const productName = button.getAttribute('data-product-name');
    const productPrice = button.getAttribute('data-product-price');

    const product = {
      id: productId,
      name: productName,
      price: productPrice,
      quantity: 1
    };

    addToCart(product);
  });
});

function addToCart(product) {
  // Check if product is already in the cart
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1; // Increment quantity
  } else {
    cart.push(product); // Add new product to cart
  }
  
  updateCartCount();
}

function updateCartCount() {
  const cartCount = cart.reduce((total, product) => total + product.quantity, 0);
  // Update the DOM with the new count
  document.querySelector('.cart-icon').textContent = `Cart (${cartCount})`;
}

let lastScrollTop = 0; // Keep track of last scroll position

window.addEventListener("scroll", function() {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  if (currentScroll > lastScrollTop) {
    // Scroll Down
    if (currentScroll > 150) { // Adjust the 150 to where you want the header to hide
      document.querySelector('header').classList.add('header-hidden');
    }
  } else {
    // Scroll Up
    document.querySelector('header').classList.remove('header-hidden');
  }
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
}, false);

