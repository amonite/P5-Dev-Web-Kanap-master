// confirmation.js

function getURL(){
    return window.location.href;
}


function getProductId(){
    let url = new URL(getURL());
    let productId = url.searchParams.get("id");

    return productId;
}

let prod_id = getProductId();

document.getElementById("orderId").innerText = prod_id;

// remove cart from local storage

// localStorage.removeItem("cart");