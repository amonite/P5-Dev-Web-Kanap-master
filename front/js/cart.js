//cart.js

/***********************************************************************************************/
/* Get items from the cart (localStorage) and display them 
/***********************************************************************************************/

async function loadData(){
    
    if(localStorage.length !== 0){
        let kanapList = [];
        
        kanapList = JSON.parse(localStorage.getItem("cart"));
        console.log(kanapList[0].id); //debug 

        for(k=0;k<kanapList.length;k++){

            let article = document.createElement("article");
            article.classList.add("cart__item");
            article.setAttribute("data-id",kanapList[k].id);
            article.setAttribute("data-color",kanapList[k].color);
            document.getElementById("cart__items").appendChild(article);
            
            let div_itemImg = document.createElement("div");
            div_itemImg.classList.add("cart__item__img");
            article.appendChild(div_itemImg);
            
            let div_itemContent = document.createElement("div");
            div_itemContent.classList.add("cart__item__content");
            article.appendChild(div_itemContent);
            
            let div_itemContentDesc = document.createElement("div");
            div_itemContentDesc.classList.add("cart__item__content__description");
            div_itemContent.appendChild(div_itemContentDesc);

            let pPrice; // hack to get the price to display after the color 
            let oriPrice;
            await fetch("http://localhost:3000/api/products/"+kanapList[k].id)
                .then(function(res){
                    if(res.ok){
                        console.log("res ok");
                        return res.json();
                    }
                })
                .then(function(data){
                    // get image 
                    let url = data.imageUrl;
                    console.log("url = "+url);
                    let img = document.createElement("img");
                    img.setAttribute("src", url);
                    img.setAttribute("alt", "photographie d'un canapé");
                    div_itemImg.appendChild(img);
                    // get name 
                    let h2 = document.createElement("h2");
                    h2.innerText = data.name;
                    div_itemContentDesc.appendChild(h2);
                    // get color
                    // ...
                    // get price
                    pPrice = document.createElement("p");
                    pPrice.innerText = data.price * kanapList[k].quantity; // p quantity * p price 
                    oriPrice = data.price;
                    // div_itemContentDesc.appendChild(pPrice);
                    
                })
                .catch(function(error){
                    console.log("error fetching data !!!!");
            })
            
            // // get color
            let pColor = document.createElement("p");
            pColor.innerText = kanapList[k].color;
            div_itemContentDesc.appendChild(pColor);

            div_itemContentDesc.appendChild(pPrice); //!!!! placed here in order to display price after color !


            // get quantity
            let div_itemContentSettings = document.createElement("div");
            div_itemContentSettings.classList.add("cart__item__content__settings");
            div_itemContent.appendChild(div_itemContentSettings);
            let div_itemContentSettingsQauntity = document.createElement("div");
            div_itemContentSettingsQauntity.classList.add("cart__item__content__settings__quantity");
            div_itemContentSettings.appendChild(div_itemContentSettingsQauntity);
            let pQuantity = document.createElement("p");
            pQuantity.innerText = "Qté : ";
            div_itemContentSettingsQauntity.appendChild(pQuantity);
            let input = document.createElement("input");
            input.setAttribute("type", "number");
            input.classList.add("itemQuantity");
            input.setAttribute("name", "itemQuantity");
            input.setAttribute("min", "1");
            input.setAttribute("max", "100");
            input.setAttribute("value", kanapList[k].quantity);

            // Store original product price to calculate total 
            // let originalPrice = pPrice.innerText;

            let previousQuantity = 0;

            input.addEventListener("change", function(){
                let kanaps = JSON.parse(localStorage.getItem("cart"));
                let article = this.closest("article")
                let _id = article.getAttribute("data-id");

                let color = article.getAttribute("data-color");
                
                console.log("_id = "+ _id);
                for(k=0;k<kanaps.length;k++){
                    if(_id == kanaps[k].id && color == kanaps[k].color){
                        // let quantity = parseInt(this.value) + parseInt(kanaps[k].quantity);
                        // console.log(quantity);
                        kanaps[k].quantity = this.value.toString();
                        localStorage.setItem("cart", JSON.stringify(kanaps));
                    }
                } 
                
                // get price element 
                let divQuantity = this.parentElement;
                
                let divSettings = divQuantity.parentElement;
            
                let divDesc = divSettings.previousElementSibling;
            
                let nodes = divDesc.childNodes;
                let currentPrice = parseInt(nodes[2].innerText);
              
                

                //quantity 
                if(previousQuantity == 0){
                    previousQuantity = this.defaultValue;
                } 
                console.log("previousQuantity = "+ previousQuantity);
                let curentQuantity = this.value;
                console.log("currentQuantity = "+ curentQuantity);
                if(previousQuantity < curentQuantity ){
                    console.log("increased !");
                    totalQuantity.innerText = (parseInt(totalQuantity.innerText)+1).toString();
                    nodes[2].innerText = (currentPrice + parseInt(oriPrice)).toString();

                    totalPrice.innerText = (parseInt(totalPrice.innerText)+parseInt(oriPrice)).toString();
                }
                else if(previousQuantity > curentQuantity){
                    console.log("decreased !");
                    totalQuantity.innerText = (parseInt(totalQuantity.innerText)-1).toString();
                    nodes[2].innerText = (currentPrice - parseInt(oriPrice)).toString();

                    totalPrice.innerText = (parseInt(totalPrice.innerText)-parseInt(oriPrice)).toString();

                }
                previousQuantity = curentQuantity;
               
                 


            });

            div_itemContentSettingsQauntity.appendChild(input);

            let div_itemContentSettingsDelete = document.createElement("div");
            div_itemContentSettingsDelete.classList.add("cart__item__content__settings__delete");
            div_itemContentSettings.appendChild(div_itemContentSettingsDelete);

            let pDel = document.createElement("p");
            pDel.classList.add("deleteItem");
            pDel.innerText = "Supprimer";
            div_itemContentSettingsDelete.appendChild(pDel);

            pDel.addEventListener("click", function(){
                let kanaps = JSON.parse(localStorage.getItem("cart"));
                let article = this.closest("article");
                let id = article.getAttribute("data-id");
                let color = article.getAttribute("data-color");

                console.log("clicked id = "+ id);
                console.log("clicked color = "+ color);

                for(k=0; k<kanaps.length; k++){
                    if(id == kanaps[k].id && color == kanaps[k].color){
                        
                        kanaps.splice(k,1);
                        localStorage.setItem("cart", JSON.stringify(kanaps));
                    }
                }

                
                // get product price befoore delete 
                let divImg = article.childNodes;
                // divImg[1].style.border = "1px solid red";
                let divContent = divImg[1].childNodes;
                // divContent[0].style.border = "1px solid blue";
                let p = divContent[0].childNodes;
                // p[2].style.border = "1px solid green";

                let priceBeforeDelete = parseInt(p[2].innerText);
                let totalPriceSpan = document.getElementById("totalPrice");
                let totalPrice = parseInt(totalPriceSpan.innerText);
                totalPriceSpan.innerText = (totalPrice - priceBeforeDelete).toString();

                //update quantity
                let divDel = this.parentElement;
                let divQuantity = divDel.previousElementSibling;
                let input = divQuantity.childNodes;
                let quantity = input[1].value; 
                totalQuantity.innerText = (parseInt(totalQuantity.innerText)-parseInt(quantity)).toString();

                article.remove();

            });

        }

    }
    else{
        console.log("LS empty !");
    }
    // let totalPrice = document.getElementById("totalPrice");
    let allPrices = document.getElementsByClassName("cart__item__content__description");
    
    console.log("allPrices ="+allPrices.length);
    let nodes = [];
    for(i=0; i<allPrices.length; i++){
        nodes[i] = allPrices[i].childNodes;
    }
    console.log("nodes = "+nodes[0][2].innerText);
    let priceArray = [];
    let finalPrice = 0;
    for(n=0; n<nodes.length ;n++){
        priceArray[n] = nodes[n][2].innerText;
        console.log("final array = "+ priceArray[n]);
        finalPrice = finalPrice + parseInt(priceArray[n]);
    }
    console.log("final price = "+finalPrice);
    totalPrice.innerText = finalPrice;

    // get all quantities 
    let divNodes = [];
    for(d=0; d<divQuantityAll.length; d++){
        divNodes[d] = divQuantityAll[d].childNodes;
    }
    // divNodes[0][1].style.border = "1px solid red";
    console.log("divNodes value = "+divNodes[0][1].value);

    let qTable = [];
    let finalQuantity = 0;
    for(i=0; i<divNodes.length; i++){
        qTable[i] = divNodes[i][1].value;
        console.log("qTable values = "+qTable[i]);
        finalQuantity = finalQuantity + parseInt(qTable[i]);
    }
    totalQuantity.innerText = finalQuantity;

}

let totalQuantity = document.getElementById("totalQuantity");
// initialize totalQuantity to avoid NAN errors
let initialValue = 0;
totalQuantity.innerText = initialValue.toString();
let divQuantityAll = document.getElementsByClassName("cart__item__content__settings__quantity");

let totalPrice = document.getElementById("totalPrice");

// check if cart is empty then remove LS key;
// if(localStorage.length !== 0){
//     let kanapList = JSON.parse(localStorage.getItem("cart"));
//     if(kanapList.length == 0){
//     localStorage.removeItem("cart");

//     }
// } 

loadData();

function getIDs(){
    
    let items = document.getElementsByClassName("cart__item");
    let ids = [];
    for(i=0; i<items.length; i++){
        ids[i] = items[i].getAttribute("data-id");
        console.log("ids = "+ids[i]);
    }

    return ids
}

let orderBtn = document.getElementById("order");



orderBtn.addEventListener("click", async function(e){
    e.preventDefault();
    let contact = getFormData();
    if(contact !== false){
        console.log("contact = "+contact);
        let products = getIDs();//JSON.parse(localStorage.getItem("cart"));//getCart(); 
        console.log("getIDs = "+products);

        let res = await fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                'Content-Type': "application/json;charset=utf-8"
            },
            body: JSON.stringify({contact:contact, products:products}) 
        });
        let data = await res.json();
        console.log("order id = "+data.orderId);
        window.location.assign("./confirmation.html?id="+data.orderId);
    }   
    //get order id in POST response
    // fetch("http://localhost:3000/api/products/order", {
    //     method: "POST",
    //     headers: {
    //         'Content-Type': "application/json;charset=utf-8"
    //     },
    //     body: JSON.stringify({contact:contact, products:products}) 
    //     })
    //     .then(function(res){
    //         if(res.ok){
    //         console.log("res1 = "+res.json);
    //         return res.json()
    //         }
    //     })
    //     .then(function(data){
    //         console.log("data = "+data);
    //         console.log("order id = "+data.orderId);
            
    //         let input = document.getElementById("order");
    //         input.setAttribute("formaction", "./confirmation.html?id="+data.orderId);
            
    //         // console.log("input attribute = "+input.getAttribute("formaction"));
    //     })

    //     .catch(function(error){
    //     console.log("error = "+error);
    // })


});

function getFormData(){
    let contact = {};

    contact.firstName = document.getElementById("firstName").value;
    if(!contact.firstName.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)){
        let p = document.getElementById("firstNameErrorMsg");
        p.innerText = "veillez entrer un prénom qui ne comporte pas de caractères numériques";
        contact.firstName = "";
    }
    else{
        contact.firstName = document.getElementById("firstName").value;

    }
    
    contact.lastName = document.getElementById("lastName").value;
    if(!contact.lastName.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)){
        let p = document.getElementById("lastNameErrorMsg");
        p.innerText = "veillez entrer un nom qui ne comporte pas de caractères numériques";
        contact.lastName = "";
    }
    else{
        contact.lastName = document.getElementById("lastName").value;

    }

    contact.city = document.getElementById("lastName").value;
    if(!contact.city.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)){
        let p = document.getElementById("cityErrorMsg");
        p.innerText = "veillez entrer un nom de ville";
        contact.city = "";
    }
    else{
        contact.city = document.getElementById("lastName").value;

    }

    contact.address = document.getElementById("address").value;
    if(!contact.address.match(/^([1-9][0-9]*(?:-[1-9][0-9]*)*)[\s,-]+(?:(bis|ter|qua)[\s,-]+)?([\w]+[\-\w]*)[\s,]+([-\w].+)$/gmiu)){
        let p = document.getElementById("addressErrorMsg");
        p.innerText = "veillez entrer une adresse postale valide";
        contact.address = "";
    }
    else{
        contact.address = document.getElementById("address").value;

    }
    contact.email = document.getElementById("email").value;
    if(!contact.email.match(/^([a-z]|[0-9]|\-|\_|\+|\.)+\@([a-z]|[0-9]){2,}\.[a-z]{2,}(\.[a-z]{2,})?$/gm)){
        let p = document.getElementById("emailErrorMsg");
        p.innerText = "veillez entrez une adresse email valide";
        contact.email = "";
    }
    else{
        contact.email = document.getElementById("email").value;

    }
    if(contact.firstName !=="" && contact.lastName !=="" && contact.city !=="" && contact.address !=="" && contact.email !==""){
        return contact;

    }
    else{
        return false;
    }
    // return contact;
}

function getCart(){
    let cart = JSON.parse(localStorage.getItem("cart"));
    return cart;
}