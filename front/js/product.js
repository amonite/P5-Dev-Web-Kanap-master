// product.js

function getURL(){
    return window.location.href;
}

function getProductId(){
    let url = new URL(getURL());
    let productId = url.searchParams.get("id");

    return productId;
}

let prod_id = getProductId();

console.log(prod_id);

function getProductData(){
    fetch("http://localhost:3000/api/products/"+prod_id)
        .then(function(res){
            if(res.ok){
                return res.json();
            }
        })
        .then(function(data){
            console.log(data); //debug
            
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
            console.log("punaise ! "+ error);
    })
}

getProductData();

if(window.localStorage.length !==0){
    var kanapList = JSON.parse(localStorage.getItem("cart"));
    console.log("kanapList from LS not empty = "+kanapList);
}
else{
    var kanapList = [];
    console.log("kanapList from LS empty = "+kanapList);
}


 
// declare kanap object inside function because objects are passed by reference
// I was going crazy because array.push overwrites elements if declared outside addToCart() !!!

async function addToCart(){
    console.log("button clicked !") // debug 
    /* get page data */
    var kanap = {};                                 
    kanap.id = getProductId();
    console.log("kanap id "+kanap.id);

    kanap.quantity = document.getElementById("quantity").value;
    console.log("kanap quantity = "+kanap.quantity);

    kanap.color = document.getElementById("colors").value;
    console.log("kanap color = "+kanap.color);

    /* ======================================== */
    /* populate array */

    if(window.localStorage.length !== 0){
        console.log("local storage not empty....");
        
        // get cart 
        let lskanapList = JSON.parse(localStorage.getItem("cart"));
        console.log("lskanapList = "+lskanapList);
        
        // iterate cart 
        for(k=0;k<lskanapList.length;k++){
            
            if(kanap.id == lskanapList[k].id){
                console.log("matching ids !!!!!!!!!!");
                if(kanap.color == lskanapList[k].color){
                    console.log("matching colors !!!!!!!!!!");
                    let quantity = parseInt(lskanapList[k].quantity) + parseInt(kanap.quantity);
                    kanapList[k].quantity = quantity.toString();
                    //kanapList.push(kanap);
                    await storeData();
                    console.log("new quantity "+ kanapList[k].quantity);
                    
                    return;   
                }
                
            }
            
        }
        kanapList.push(kanap);
        await storeData();

    }
    else{
        kanapList.push(kanap);
        
        await storeData();
        console.log("new kanap added from inside if/else !");
    }
}

async function storeData(){
    localStorage.setItem("cart", JSON.stringify(kanapList));
}

document.getElementById("addToCart").addEventListener("click", addToCart);


