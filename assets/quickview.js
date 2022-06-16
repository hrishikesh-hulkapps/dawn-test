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
        // let requestURl = `/products/${handle}.json`;
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
                // script.src = "https://abcapis.com/sample.js"; 
                // document.getElementsByTagName("head")[0].appendChild(script);

            })
            .catch(error => console.error('Error:', error))
            .finally(() => console.log(101))

        

        // get HTML elements
        // const pTitle = document.querySelector('.modal-product-title');
        // const pDescription = document.querySelector('.modal-product-description');
        // const pImage= document.querySelector('.modal-featured-image');

        // pTitle.innerHTML = data.product.title;
        // pDescription.innerHTML = data.product.body_html;
        // pImage.src = data.product.image.src;

        // modal.classList.add('show-modal');
    }
    
    
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


 
