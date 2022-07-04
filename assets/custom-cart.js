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
    let gwp= 0;
    let currentQty = parseInt(e.target.parentNode.querySelector('.quantity-input').value);
    let currentVariantid = e.target.parentNode.querySelector('.quantity-input').dataset.variantid;
    // let currentVariantid = e.target.parentNode.querySelector('.quantity-input').dataset.line;

    let currentProductType = e.target.parentNode.querySelector('.quantity-input').dataset.producttype || 0;
    let currentProductUniqueId = e.target.parentNode.querySelector('.quantity-input').dataset.uniqueid || 0;

    // console.log(currentProductType)
    // console.log(currentProductUniqueId)
    // return

    let action = e.target.name;
   
    if(action == 'plus') {
        gwp = 1
        currentQty += 1;
        console.log(currentQty)
        updateCart(currentQty, currentVariantid, gwp, currentProductType, currentProductUniqueId)
        // gwpCheckCartTotal()
        //updateUI()

    } else if(action == 'minus') {
        gwp = -1
        console.log(currentQty)

        if(currentQty != 0) {
            currentQty -= 1;
            updateCart(currentQty, currentVariantid, gwp, currentProductType, currentProductUniqueId)

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
    let currentVariantid = e.target.parentNode.dataset.variantid
    let currentQuantity = 0;
    updateCart(currentQuantity, currentVariantid)
}

function updateCart(quantity, variantId, gwp = 0, productType, productUniqueId) {
    // create data to pass 
    let data = {
        'id': variantId,
        'quantity': quantity
    }

    // bundle data
    let mainProduct = {}
    const key = variantId
    mainProduct[key] = quantity

    // let final;
    // console.log(productType)
    // console.log(productUniqueId)
    // return

    if( productType == 'main-product' && productUniqueId !=0 ) {

        // get cart data
        let reqURL = window.shopUrl + '/cart.js'
        fetch(reqURL)
        .then(res => res.json()) 
        .then(data => {
            console.log('from getCartJSON')
            // console.log(data)
            let items = data.items

            let temp=  {}
            // find the id or addon products 
            items.forEach(item => {
                
                if(item.properties != null ) {
                     // check if there is subproduct for unique id 
                    if(item.properties.uniqueId == productUniqueId && item.properties.productType == 'sub-product') {
                        let k = item.variant_id
                        temp[k] = quantity
                        console.log(item.variant_id)
                    }
                }

            });

            // append to mainProduct variable 
            let updates = Object.assign(mainProduct,temp);
            updates = {
                updates: updates
            }

            // make a update call 
            updateBundle(updates, gwp);

            // // gwp function call add
            //  if( gwp == 1) {
            //     gwpCheckCartTotal()
            //     updateUI()
            //     return
            // }

            // if( gwp == -1 ) {
            //     gwpRemoveFromCart()
            //     updateUI()
            //     return
            // }

            // updateUI()
            // return
        })
        .catch(error => {
            console.log(error);
        })
        return

    } else {

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

            // gwp function call add
            if( gwp == 1) {
                gwpCheckCartTotal()
                updateUI()
                return
            }

            if( gwp == -1 ) {
                gwpRemoveFromCart()
                updateUI()
                return
            }
        
            // update UI 
            updateUI();
        })
        .catch(error => {
            console.log(error);
        })
    }
    
}

// function to update bundle
function updateBundle(updates, gwp) {

    let requestURL = window.shopUrl + window.routes.cart_update_url + '.js';
    fetch(requestURL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(updates)
    })
    .then(response => {
        let data = response.text();
        if (!response.ok) {
            throw new Error("HTTP error" + response.status);
        }
        console.log('updated the bundle product ');

        // gwp function call add
        if( gwp == 1) {
            gwpCheckCartTotal()
            updateUI()
            return
        }

        if( gwp == -1 ) {
            gwpRemoveFromCart()
            updateUI()
            return
        }

        updateUI()
        return
        // updateUI();
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
        let updatedCart = cartHTML.querySelector('#section-cart-block .blocks-holder');
        // console.log(cartHTML);
        // return
        cart.removeChild(cart.querySelector('.blocks-holder'));
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
      // return;

        // check to hide free item   
        disableGWP()
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

// gwp js

function gwpCheckCartTotal() {

    let reqURL = window.shopUrl + '/cart.js'

    fetch(reqURL)
    .then(res => res.json()) 
    .then(data => {
       
        let items = data.items
        console.log('From gwpCheckCartTotal() -> ')
        console.log(data)

        let cartSubTotal = data.items_subtotal_price/100

        const gwpAmount = document.querySelector('#gwp_amount').innerHTML;
        const gwp_name = document.querySelector('#gwp_name').innerHTML;
        console.log(cartSubTotal)
        console.log(gwpAmount)

        // check if total is > free product value
        if( cartSubTotal > gwpAmount) {
            console.log('yes greater')
            
            let flag = 0
            // check if free product exists in cart
            items.forEach(item => {

                if( item.price == 0 && item.product_type == 'gwp') {
                    // do nothing
                    flag = 1;
                } 
            });

            // gwp product exists
            if(flag == 0) {
                // add free product to cart 
                // get product id 
                let reqURL = window.shopUrl + '/products/' + gwp_name + '.json'
                console.log(reqURL)

                fetch(reqURL)
                .then(res => res.json()) 
                .then(data => {
                    console.log(data.product.variants[0].id)
                    let variantId = Number( data.product.variants[0].id )
                    let quantity = 1; 
                    // let gwp = 0

                    gwpAddToCart(quantity, variantId)
                    console.log('updated gwp in the cart')

                })
                .catch(error => {
                    console.log(error);
                })
            }

        } else {

            console.log('less crt tot')

        }
    //    return;
       
   })
   .catch(error => {
       console.log(error);
   })
}

// add gwp to cart
function gwpAddToCart(quantity, variantId) {

     // create data to pass 
    let items = [
        {
            id: variantId,
            quantity: quantity
        }
    ]
    let data = { items }
    
    // console.log(items);
    // return
    // make post request to add 
    let requestURL = window.shopUrl + window.routes.cart_add_url + '.js';
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
        console.log('added gwp to cart');

        // update UI 
        updateUI();
        // disableGWP()
    })
    .catch(error => {
        console.log(error);
    })

}

// function to disable gwp listners
function disableGWP() {

    const cartTable = document.querySelectorAll('#custom-cart-body tr');

    cartTable.forEach(tr => {
        let price = tr.querySelector('.item-total-price').textContent;
        console.log(price)
        if( price.trim() == '$0.00') {
            console.log('found gwp')
            tr.querySelector('.quantity-wrapper').style.cssText = 'display:none!important';

        }
        //  
    });
}

function gwpRemoveFromCart() {

    console.log('in gwpRemoveFromCart')
    let reqURL = window.shopUrl + '/cart.js'

    fetch(reqURL)
    .then(res => res.json()) 
    .then(data => {

        let items = data.items

        let cartSubTotal = data.items_subtotal_price/100

        const gwpAmount = document.querySelector('#gwp_amount').innerHTML;
        const gwp_name = document.querySelector('#gwp_name').innerHTML;

        console.log(cartSubTotal)
        console.log(gwpAmount)

        if( cartSubTotal > gwpAmount) {
            // do nothing
        } else {
            
            // check if free product exists in cart
            let flag = 0
            items.forEach(item => {

                if( item.price == 0 && item.product_type == 'gwp') {
                    // do nothing
                    flag = 1;
                } 
            });

            if(flag == 1) {

                // remove gwp from cart 
                // get product id 
                let reqURL = window.shopUrl + '/products/' + gwp_name + '.json'
                console.log(reqURL)

                fetch(reqURL)
                .then(res => res.json()) 
                .then(data => {
                    console.log(data.product.variants[0].id)
                    let variantId =  (data.product.variants[0].id).toString()
                    let quantity = 0; 
                    // let gwp = 0

                    updateCart(quantity, variantId)
                    // gwpAddToCart(quantity, variantId)
                    console.log('removed gwp from cart')

                })
                .catch(error => {
                    console.log(error);
                })
            }

        }

    })
    .catch(error => {
        console.log(error);
    })
}

// function getCartJSON() {

//     let reqURL = window.shopUrl + '/cart.js'

//     fetch(reqURL)
//     .then(res => res.json()) 
//     .then(data => {
//         console.log('from getCartJSON')
//         return data
//     })
//     .catch(error => {
//         console.log(error);
//     })
// }

disableGWP()