window.onload = function() {

    // get all the elements
    const modal = document.querySelector(".modal");
    const trigger = document.querySelectorAll(".trigger");
    const closeButton = document.querySelector(".close-button");

    // add event listner to button
    trigger.forEach( btn => {
        btn.addEventListener('click', showModal.bind(btn.dataset.handle));
    })


    function getProductData(handle) {
        let requestURl = `/products/${handle}?view=alternate-test`;

        fetch(requestURl)
            .then(response => response.text())
            .then(data => {
              
                // Convert the HTML string into a document object
                var parser = new DOMParser();
                var doc = parser.parseFromString(data, 'text/html');

                // show modal
                modal.classList.add('show-modal');
                document.querySelector('.modal-html').innerHTML = "";
                document.querySelector('.modal-html').append(doc.querySelector("#MainContent"));

                // load js
                // var script = document.createElement("script");
                // script.src = "https://cdn.shopify.com/s/files/1/0639/8106/0337/t/4/assets/for-quickview.js?v=137001516344559235161655367625"; 
                // document.getElementsByTagName("head")[0].appendChild(script);

            //    aadd listner to optin select
                // const optionsSelect = document.querySelectorAll('.select-option');
                // // set event listners
                // optionsSelect.forEach(option => {
                //     option.addEventListener('change', variantChange.bind(this));
                // })    
            
                //add listner to swatch img
                const cs = document.querySelectorAll('.swatch-image');
                cs.forEach(li => {
                    li.addEventListener('click', updateVariant.bind(this));
                    console.log('added eve list to .swatchimg')
                })

               
              
            })
            .catch(error => console.error('Error:', error))
            // .finally(() => console.log(101))
    }

    // for color swatch liquid -- update variant for color swatch
    // function updateVariant(e) {

    //     // get selected value 
    //     // const selected = e.path[1].firstElementChild.innerHTML.trim();
    //     const selected = e.path[1].dataset.color;
    //     console.log(selected);
    //     // return

    //     // update default select 
    //     const colorDrop = document.querySelector('.color-drop');

    //     colorDrop.value = selected;
    //     // call variant change
    //     variantChange();
    // }
        
    
    // function toggleModal(e) {
    //     // console.log(e.dataset.handle);
    //     let handle = e.dataset.handle; 
    //     modal.classList.toggle("show-modal");

    //     let data = getProductData(handle);
    // }
   
    // show modal
    function showModal(e) {
        // modal.classList.add('show-modal');

        let handle = e.path[0].dataset.handle; 
        console.log(handle);

        // console.log(e.path[0].dataset.handle);
        let data = getProductData(handle)
        

        // update modal
        // console.log(data);
    }

    // hide modal
    function hideModal() {
        modal.classList.remove('show-modal');
    }

    // close on click elsewhere
    function windowOnClick(event) {
        if (event.target === modal) {
            hideModal();
        }
    }

    // trigger.addEventListener("click", toggleModal);
    closeButton.addEventListener("click", hideModal);
    window.addEventListener("click", windowOnClick);

}