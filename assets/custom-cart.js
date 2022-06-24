function setListeners() {
    // Set listner to qty buttons 
    const qtyButton = document.querySelectorAll('.quantity-button');
    qtyButton.forEach(btn => {
        btn.addEventListener('click', getData.bind(this));
    })  

        // Set listner to quantity input
    const quantityInput = document.querySelectorAll('.quantity-input');
    quantityInput.forEach(input => {
        input.addEventListener('click', getDataInput.bind(this));
    })

    // set listner to remove item btn
    const removeButton = document.querySelectorAll('.delete-cart-item');
    removeButton.forEach(btn => {
        btn.addEventListener('click', getDataFromRemove.bind(this));
    })  

    // set listner to clear cart btn 
    const cartClearBtn = document.querySelector('.clear-cart-btn');
    cartClearBtn.addEventListener('click', clearCart);

    // set listener to delivery date
    const deliveryDate = document.querySelector('#delivery-date');
    deliveryDate.addEventListener('change', updateCartAttirbutes.bind(this));
}

// function to update cart attribute
function updateCartAttirbutes(e) {
    // console.log(e.target.value)
    let data = JSON.stringify({
        attributes: { 
            deliveryDate: e.target.value
        }
    })
    let requestURL = window.shopUrl + window.routes.cart_update_url + '.js';
    
    fetch(requestURL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: data
    })
    .then(response => {
        let data = response.text();
        // console.log(response);
        
        if (!response.ok) {
            throw new Error("HTTP error" + response.status);
        }
        // alert('updated attribute');
        console.log('updated the attribute ');

        // update UI 
        // updateUI();
    })
    .catch(error => {
        console.log(error);
    })
}

// function to arrange data and call updateQTY for qty buttons 
function getData(e) {
    console.log('in getData (from button)')

    let currentQty = parseInt(e.target.parentNode.querySelector('.quantity-input').value);
    let currentVariantid = e.target.parentNode.querySelector('.quantity-input').dataset.line;
    let action = e.target.name;
   
    if(action == 'plus') {
        currentQty += 1;
        console.log(currentQty)
        updateCart(currentQty, currentVariantid)
    } else if(action == 'minus') {
        console.log(currentQty)

        if(currentQty != 0) {
            currentQty -= 1;
            updateCart(currentQty, currentVariantid)
        }
    }
    // console.log(e.target.name);
}

// get data from input and call update
function getDataInput(e) {
        
    let currentVariantid = e.target.dataset.line
    let currentQuantity = e.target.value
    if(currentQuantity != 0) {
        updateCart(currentQuantity, currentVariantid)
    }
}

// function to get data from remove item button & call updateCart
function getDataFromRemove(e) {
    let currentVariantid = e.target.parentNode.dataset.line
    let currentQuantity = 0;
    updateCart(currentQuantity, currentVariantid)
}

function updateCart(quantity, variantId) {
    // create data to pass 
    let data = {
        'line': variantId,
        'quantity': quantity
    }
    // console.log(data);
    // return
    // make post request
    let requestURL = window.shopUrl + window.routes.cart_change_url + '.js';
    // console.log(requestURL);
    // return
    fetch(requestURL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        let data = response.text();
        // console.log(response);
        // return
        if (!response.ok) {
            throw new Error("HTTP error" + response.status);
        }
        // alert('Added to cart');
        console.log('updated the value ');

        // update UI 
        updateUI();
    })
    .catch(error => {
        console.log(error);
    })
}

// clear cart js 
function clearCart() {

    let reqURL = window.shopUrl + window.routes.cart_clear_url + '.js';
    fetch(reqURL, {
        method: 'POST', headers: { "Content-Type": "application/json", "Accept": "application/json" }
    })
    .then(response => {

        console.log('CART IS CLEAR  (update HTML) ');
        updateUI();

    })
    .catch(error => {
        console.log(error);
    })
}

// function to update the UI/HTML
function updateUI() {

    const cart = document.querySelector('#section-cart-block');
    const cartTable = document.querySelector('.cart-details');
    const cartTotal = document.querySelector('.cart-total');
    const freeShippingBar = document.querySelector('.free-shipping-bar');
    
    let reqURL = window.shopUrl + '/cart?sections=custom-cart'
    
    // console.log(reqURL)
    // return
    fetch(reqURL)
     .then(respnse => respnse.json()) 
     .then(data => {
        
        // console.log(data['custom-cart'])
        // return

        let cartHTML = data['custom-cart'];
        let parser = new DOMParser();
        cartHTML = parser.parseFromString(cartHTML, 'text/html');

        // update all 
        let updatedCart = cartHTML.querySelector('#section-cart-block .cart-container');
        console.log(cartHTML);
        return
        cart.removeChild(cart.querySelector('.cart-container'));
        cart.appendChild(updatedCart);

        // // update cart data
        // let updatedCartTableBody = cartHTML.querySelector('#custom-cart-body');
        // cartTable.removeChild(cartTable.querySelector('#custom-cart-body'));
        // cartTable.appendChild(updatedCartTableBody);

        // // update total        
        // let updatedTotal = cartHTML.querySelector('.cart-total .price')
        // cartTotal.removeChild(cartTotal.querySelector('.price'))
        // cartTotal.appendChild(updatedTotal);
    
        // // update free shipping bar
        // let updatedfreeShippingBar = cartHTML.querySelector('.free-shipping-bar .free-shipping-details');
        // // console.log(cartHTML.querySelector('.free-shipping-bar .free-shipping-details'))
        // // return
        // freeShippingBar.removeChild(freeShippingBar.querySelector('.free-shipping-details'))
        // freeShippingBar.appendChild(updatedfreeShippingBar);

        // Set listner to quantity BUTTONS
        setListeners();

        console.log('updateUI() done')
        return;
        
    })
    .catch(error => {
        console.log(error);
    })

}

document.addEventListener("DOMContentLoaded", function () {

    setListeners();
    
    // if(window.location.href == window.shopUrl + '/cart') {
    //     const cartClearBtn = document.querySelector('.clear-cart-btn');
    //     cartClearBtn.addEventListener('click', clearCart);
    // }

});

// cart drawer js - here

function openNav() {
    document.getElementById("cart-drawer").style.width = "40%" //opens side navbar by 40 percent
    document.getElementById('backdrop').style.display = "block" //displays overlay
    getCartData()
}

function closeNav() {
    document.getElementById("cart-drawer").style.width = "0"
    document.getElementById('backdrop').style.display = "none"
}

function getCartData() {

    const cartDrawer = document.querySelector('#cart-drawer');

    let reqURL = `{{ shop.url }}/cart?sections=custom-cart`
    fetch(reqURL)
    .then(respnse => respnse.json()) 
    .then(data => {
        
        // get cart html
        let cartHTML = data['custom-cart'];           
        let parser = new DOMParser();
        cartHTML = parser.parseFromString(cartHTML, 'text/html');   
        let cartMain = cartHTML.querySelector('#section-cart-block');
        
        // create new block       
        const cartBlock = document.createElement("div");
        cartBlock.classList.add("cart-block");
        cartBlock.append(cartMain)

        
        // update html
        cartDrawer.removeChild(cartDrawer.querySelector('.cart-block'))
        cartDrawer.appendChild(cartBlock);

        // set listeners
        setListeners();            
        
        
    })
    .catch(error => {
        console.log(error);
    })
}