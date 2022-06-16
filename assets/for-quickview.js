const form = document.querySelector('.options-form');
const optionsSelect = document.querySelectorAll('.select-option');
const variantJSON = form.querySelector('[data-variantJSON]');
const addToCart = document.querySelector('#add-to-cart-btn');

const variantSelect = document.querySelector('#variants');
const items = document.querySelector('#id');

addToCart.addEventListener('click', submitFormFree.bind(this));

// set event listners
optionsSelect.forEach(option => {
    option.addEventListener('change', variantChange.bind(this));
})    





// get options on event change
function variantChange(e) {
    let options = [];
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
// Pending
function submitFormFree(e) {
    e.preventDefault();
    
    // let data = new FormData(form);
    // // console.log(JSON.stringify(data));

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
    const lineItemName = document.querySelector('#your-name');
    const lineItemBirthdate = document.querySelector('#your-birthdate');

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

    // create items array
    items = [{
        id : variantSelect.value,
        quantity : quantity.value,
        properties: ""
    }]

    // add line items to array
    if( lineItemBirthdate.value || lineItemName.value ) {
        let properties =  {
            "_Name": lineItemName.value,
            "_Birthdate": lineItemBirthdate.value
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
                quantity: 1
            }
            items.push(data);
        }

    })       

    console.log(items);
    console.log( JSON.stringify(items) );
    // return;


    // make post request
    let requestURL = "{{ routes.cart_add_url }}" + '.js';
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
        console.log('added to cart');
    })
    .catch(error => {
        console.log(error);
    })
    
}