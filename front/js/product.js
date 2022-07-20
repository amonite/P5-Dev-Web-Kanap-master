// product.js

/***********************************************************************************************/
/* Get id from url                                                                             */
/***********************************************************************************************/
function getURL(){
    return window.location.href;
}

function getProductId(){
    let url = new URL(getURL());
    let productId = url.searchParams.get("id");

    return productId;
}

let prod_id = getProductId();

/***********************************************************************************************/
/* Get product data with product id*/
/***********************************************************************************************/

function getProductData(){
    fetch("http://localhost:3000/api/products/"+prod_id)
        .then(function(res){
            if(res.ok){
                return res.json();
            }
        })
        .then(function(data){
            
            let img = document.createElement("img");
            img.setAttribute("src", data.imageUrl);
            img.setAttribute("alt", data.altTxt);
            
            let div = document.getElementsByClassName("item__img")[0];
            div.appendChild(img);

            document.getElementById("title").innerText = data.name;
            document.getElementById("price").innerText = data.price;
            document.getElementById("description").innerText = data.description;

            for(n=0;n<data.colors.length;n++){
                let option = document.createElement("option");
                option.setAttribute("value", data.colors[n]);
                option.innerText = data.colors[n];
                let colors = document.getElementById("colors");
                colors.appendChild(option);
            };

        })
        .catch(function(error){
            console.log("error = "+ error);
    })
}

getProductData();

/***********************************************************************************************/
/* Check if localStorage is empty                                                             */
/***********************************************************************************************/

if(window.localStorage.length !==0){
    var kanapList = JSON.parse(localStorage.getItem("cart"));
    // console.log("kanapList from LS not empty = "+kanapList);
}
else{
    var kanapList = [];
    // console.log("kanapList from LS empty = "+kanapList);
}

/***********************************************************************************************/
/* Add products to the cart and store product id, quantity and color                           */
/***********************************************************************************************/

async function addToCart(){
    // console.log("button clicked !") // debug 
    /* get page data */
    /* declare kanap object inside function because objects are passed by reference.
    /* array.push overwrites elements if kanap is declared outside addToCart() !!!*/
    var kanap = {};
    
    /* get article id */
    kanap.id = getProductId();

    /* get quantity */
    kanap.quantity = document.getElementById("quantity").value;
    if(kanap.quantity > 100){
        alert("vous ne pouvez pas ajouter plus que 100 articles dans le panier");
        return;
    }
    
    /* get color */
    kanap.color = document.getElementById("colors").value;
    
    /* check if both input are filled */
    if(kanap.quantity > 0 && kanap.color !==""){
        kanap.quantity = kanap.quantity;
        kanap.color = kanap.color;
    }
    else{
        alert("Vous devez spécifier une quantité et/ou une couleur pour ajouter un article au panier !");
        return;
    }
    
    /* populate cart array in locaStorage */
    /* check if there is already a cart in locaStorage */

    if(window.localStorage.length !== 0){
        
        /* get cart */
        let lskanapList = JSON.parse(localStorage.getItem("cart"));
        
        /* iterate cart */
        for(k=0;k<lskanapList.length;k++){
            /* check if colors and ids are the same and if so
            just update the quantity of the article */
            if(kanap.id == lskanapList[k].id && kanap.color == lskanapList[k].color){
                    
                let quantity = parseInt(lskanapList[k].quantity) + parseInt(kanap.quantity);
                kanapList[k].quantity = quantity.toString();
                    
                await storeData();
                    
                return;   
                               
            }
            
        }

        kanapList.push(kanap);
        await storeData();

    }
    else{

        kanapList.push(kanap);
        await storeData();
    
    }
}

/* get addToCart button and pass it the addToCart function when it is clicked */

document.getElementById("addToCart").addEventListener("click", addToCart);


/***********************************************************************************************/
/* Store product data into localStorage                                                        */
/***********************************************************************************************/

async function storeData(){
    localStorage.setItem("cart", JSON.stringify(kanapList));
    console.log("localStorage = "+ localStorage.getItem("cart"));
}






