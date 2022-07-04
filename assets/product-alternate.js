// Get the modal
var modal = document.getElementById('myModal');
     
// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById('myImg');
var modalImg = document.getElementById("img01");
img.onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    modalImg.alt = this.alt;
}
 
 
// When the user clicks on <span> (x), close the modal
modal.onclick = function() {
    img01.className += " out";
    setTimeout(function() {
       modal.style.display = "none";
       img01.className = "modal-content";
     }, 400);

}

// Product page single js
const form = document.querySelector('.options-form');
const optionsSelect = document.querySelectorAll('.select-option');
const variantJSON = form.querySelector('[data-variantJSON]');
const addToCart = document.querySelector('#add-to-cart-btn');

const variantSelect = document.querySelector('#variants');
const items = document.querySelector('#id');

addToCart.addEventListener('click', submitForm.bind(this));

// set event listners
optionsSelect.forEach(option => {
    option.addEventListener('change', variantChange.bind(this));
})    

// get options on event change
function variantChange(e) {
    let options = [];

    // console.log(optionsSelect)
    // return

    optionsSelect.forEach((select) => {
        options.push(select.value);
    })
    console.log(options);

    // variant array 
    let variants = JSON.parse(variantJSON.textContent);

    // get selected variant
    let currentVariant;

    variants.find((variant) => {
        let mappedValues = variant.options.map((option, index) => {
            return options[index] === option;
        });

        if (!mappedValues.includes(false)) {
            currentVariant = variant;
        }
    });

    // update URL        
    const variantURL = '?variant=' + currentVariant.id;
    history.replaceState(null, null, variantURL);

    // update select hidden 
    variantSelect.value = currentVariant.id;
    items.value = currentVariant.id;

    // update price block
    let selectedVariant = variants.find(variant => variant.id == currentVariant.id)
    const priceField = document.querySelector('#price-box');
    priceField.innerHTML = '$' + (Math.round(selectedVariant.price) / 100).toFixed(2);

    // update imaage
    const imgBlock = document.querySelector('.product-image');
    imgBlock.src = selectedVariant.featured_image.src ;
    // console.log(selectedVariant.featured_image.src);

}

// Submit form (for free product, without array) 
function submitFormFree(e) {
    e.preventDefault();
    console.log('via id[]')
    // let data = new FormData(form);
    // console.log(data);
    // console.log(JSON.stringify(data));

    // return;

    // let formDataObject = Object.fromEntries(data.entries());
    // let formDataJsonString = JSON.stringify(formDataObject);
    // console.log(formDataJsonString);
    
    form.submit();
}

function submitForm(e) {

    e.preventDefault();
    console.log(e);
    
    let items ;
    const variantSelect = document.querySelector('#variants');
    const quantity = document.querySelector('#quantity');

    // get line item properties
    const lineItemName = document.querySelector('#your-name') || '';
    const lineItemBirthdate = document.querySelector('#your-birthdate') || '    ';

    // const form = document.querySelector('#add-to-cart');
    // const formData = new FormData(form);
    // console.log(formData.values());

    // const config = fetchConfig('javascript');
    // config.headers['X-Requested-With'] = 'XMLHttpRequest';
    // delete config.headers['Content-Type'];

    // config.body = formData;

    // let requestURL = "{{ routes.cart_add_url }}" ;
    // fetch(requestURL, config)
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error("HTTP error" + response.status);
    //     }
    //     console.log('added to cart');
    // })
    // .catch( error => {
    //     console.log(error);
    // })
    // form.submit();

    // check if it has free products
    const freeCheck = document.getElementById('free-products') || '';
    console.log(freeCheck)
    let property = '';
    let uniqueId = '';
    if(freeCheck.value == 1) {
        uniqueId = Math.floor((Math.random() * 1000) + 1);
         property = {
            uniqueId: uniqueId,
            productType: 'main-product'
        }
    }

    // create items array
    items = [{
        id : variantSelect.value,
        quantity : quantity.value,
        properties: property
    }]

    // add line items to array
    if( lineItemBirthdate.value || lineItemName.value ) {
        let properties =  {
            "Name": lineItemName.value,
            "Birthdate": lineItemBirthdate.value
        }
        items[0].properties = properties
        // items.property = properties
    }
    
    // check if anycheck box is selected, if yes, get value, update in items 
    const addons = document.querySelectorAll('.addon-data input');
    addons.forEach(addon => {
        if(addon.checked) {
            // console.log(addon.value);
            let data = {
                id: addon.value,
                quantity: quantity.value,
                properties: {
                    uniqueId: uniqueId,
                    productType: 'sub-product'
                }
            }
            items.push(data);
        }

    })       

    console.log(items);
    console.log( JSON.stringify(items) );
    // return;


    // make post request
    // let requestURL = "{{ routes.cart_add_url }}" + '.js';
    let requestURL = window.shopUrl + window.routes.cart_add_url + '.js';

    fetch(requestURL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        // body: JSON.stringify({
        //     id: variantSelect.value,
        //     quantity: 1
        // })
        body: JSON.stringify({items: items})
    })
    .then(response => {

        if (!response.ok) {
            throw new Error("HTTP error" + response.status);
        }
        // alert('Added to cart');
        openNav();
        console.log('added to cart');
    })
    .catch(error => {
        console.log(error);
    })
    
}

// for color swatch liquid
document.addEventListener("DOMContentLoaded", function () {
               
    // set event listners for color swatch
    const cs = document.querySelectorAll('.swatch-image');
    cs.forEach(li => {
        li.addEventListener('click', updateVariant.bind(this));
    })

    // update variant for color swatch
    function updateVariant(e) {

        // get selected value 
        // const selected = e.path[1].firstElementChild.innerHTML.trim();
        const selected = e.path[1].dataset.color;
        console.log(selected);
        // return

        // update default select 
        const colorDrop = document.querySelector('.color-drop');

        colorDrop.value = selected;
        // call variant change
        variantChange();
    }

});