//cart.js

/***********************************************************************************************/
/* Get items from the cart (localStorage) and display them 
/***********************************************************************************************/

async function loadData(){
    
    if(window.localStorage.length !== 0){
        let kanapList = [];
        
        kanapList = JSON.parse(localStorage.getItem("cart"));
        // console.log(kanapList[0].id); //debug 

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
                    // console.log("url = "+url);
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
                    
                })
                .catch(function(error){
                    console.log("error fetching data !!!!");
            })
            
            /* get color */
            let pColor = document.createElement("p");
            /* set color */
            pColor.innerText = kanapList[k].color;
            div_itemContentDesc.appendChild(pColor);

            div_itemContentDesc.appendChild(pPrice); // placed here in order to display price after color !


            /* get quantity and set quantity */
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

            /* Store original product price to calculate total */
            let previousQuantity = 0;

            input.addEventListener("change", function(){
                let kanaps = JSON.parse(localStorage.getItem("cart"));
                let article = this.closest("article")
                let _id = article.getAttribute("data-id");

                let color = article.getAttribute("data-color");
                
                // console.log("_id = "+ _id);
                for(k=0;k<kanaps.length;k++){
                    if(_id == kanaps[k].id && color == kanaps[k].color){
                        
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
                // console.log("previousQuantity = "+ previousQuantity);
                let curentQuantity = this.value;
                // console.log("currentQuantity = "+ curentQuantity);
                if(previousQuantity < curentQuantity ){
                    // console.log("increased !");
                    totalQuantity.innerText = (parseInt(totalQuantity.innerText)+1).toString();
                    nodes[2].innerText = (currentPrice + parseInt(oriPrice)).toString();

                    totalPrice.innerText = (parseInt(totalPrice.innerText)+parseInt(oriPrice)).toString();
                }
                else if(previousQuantity > curentQuantity){
                    // console.log("decreased !");
                    totalQuantity.innerText = (parseInt(totalQuantity.innerText)-1).toString();
                    nodes[2].innerText = (currentPrice - parseInt(oriPrice)).toString();

                    totalPrice.innerText = (parseInt(totalPrice.innerText)-parseInt(oriPrice)).toString();

                }
                previousQuantity = curentQuantity;
               

            });

            div_itemContentSettingsQauntity.appendChild(input);

            /* create elements for the delete article button (Supprimer) */
            let div_itemContentSettingsDelete = document.createElement("div");
            div_itemContentSettingsDelete.classList.add("cart__item__content__settings__delete");
            div_itemContentSettings.appendChild(div_itemContentSettingsDelete);
            let pDel = document.createElement("p");
            pDel.classList.add("deleteItem");
            pDel.innerText = "Supprimer";
            div_itemContentSettingsDelete.appendChild(pDel);

            /* when the button "Supprimer" is clicked we delete the article
            if confirmed */

            pDel.addEventListener("click", function(){

                let txt = "Etes vous certain de vouloir supprimer un article ?"

                if(confirm(txt) == true){
                    /* get cart from localStorage for update later */
                    let kanaps = JSON.parse(localStorage.getItem("cart"));

                    /* get id and color of clicked article to remove it from the cart later */
                    let article = this.closest("article");
                    let id = article.getAttribute("data-id");
                    let color = article.getAttribute("data-color");

                    /* update cart with removed article */
                    for(k=0; k<kanaps.length; k++){
                        if(id == kanaps[k].id && color == kanaps[k].color){
                            
                            kanaps.splice(k,1);
                            localStorage.setItem("cart", JSON.stringify(kanaps));
                        }
                    }
                    
                    /* get product price before delete to update total price */
                    /* we use childNodes to return an array of child elements */
                    let divImg = article.childNodes;
                    let divContent = divImg[1].childNodes;
                    let p = divContent[0].childNodes;
                    let priceBeforeDelete = parseInt(p[2].innerText);
                    let totalPriceSpan = document.getElementById("totalPrice");
                    let totalPrice = parseInt(totalPriceSpan.innerText);

                    /* update cart total price */
                    totalPriceSpan.innerText = (totalPrice - priceBeforeDelete).toString();

                    /* get product quantity before delete to update total quantity */
                    let divDel = this.parentElement;
                    let divQuantity = divDel.previousElementSibling;
                    let input = divQuantity.childNodes;
                    let quantity = input[1].value; 

                    /* update cart total quantity */
                    totalQuantity.innerText = (parseInt(totalQuantity.innerText)-parseInt(quantity)).toString();
                    
                    /* remove article from the page */
                    article.remove();

                    // check if cart is empty then remove LS key;
                    if(window.localStorage.length !== 0){
                        let kanapList = JSON.parse(localStorage.getItem("cart"));
                        if(kanapList.length == 0){
                        localStorage.removeItem("cart");

                        }
                    } 
                }
                else{
                    /* if user cancels the confirmation we do nothing */
                    return;
                }
            });

        }

    /* Get prices for all the products */
    /* ================================*/
    let allPrices = document.getElementsByClassName("cart__item__content__description");
    
    // console.log("allPrices ="+allPrices.length);
    let nodes = [];
    for(i=0; i<allPrices.length; i++){
        nodes[i] = allPrices[i].childNodes;
    }
    // console.log("nodes = "+nodes[0][2].innerText);
    let priceArray = [];
    let finalPrice = 0;
    for(n=0; n<nodes.length ;n++){
        priceArray[n] = nodes[n][2].innerText;
        // console.log("final array = "+ priceArray[n]);
        finalPrice = finalPrice + parseInt(priceArray[n]);
    }
    // console.log("final price = "+finalPrice);
    totalPrice.innerText = finalPrice;

    /* Get quantities for all the products */
    /* ====================================*/
    let divNodes = [];
    for(d=0; d<divQuantityAll.length; d++){
        divNodes[d] = divQuantityAll[d].childNodes;
    }
    
    // console.log("divNodes value = "+divNodes[0][1].value);

    let qTable = [];
    let finalQuantity = 0;
    for(i=0; i<divNodes.length; i++){
        qTable[i] = divNodes[i][1].value;
        // console.log("qTable values = "+qTable[i]);
        finalQuantity = finalQuantity + parseInt(qTable[i]);
    }
    totalQuantity.innerText = finalQuantity;


    }
    else{
        console.log("LS empty !");
    }
    

}


/***********************************************************************************************/
/* Get elements from the page to display total quantity an total price of the cart
/***********************************************************************************************/

let totalQuantity = document.getElementById("totalQuantity");
let totalPrice = document.getElementById("totalPrice");

let initialValue = 0; // initialize totalQuantity to avoid NAN errors 
totalQuantity.innerText = initialValue.toString();
let divQuantityAll = document.getElementsByClassName("cart__item__content__settings__quantity");

/***********************************************************************************************/

loadData();


/***********************************************************************************************/
/* Get ids for all products in the cart to post the order
/***********************************************************************************************/

function getIDs(){
    
    let items = document.getElementsByClassName("cart__item");
    let ids = [];
    for(i=0; i<items.length; i++){
        ids[i] = items[i].getAttribute("data-id");
        // console.log("ids = "+ids[i]);
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
  


});

/***********************************************************************************************/
/* Get form data 
/***********************************************************************************************/

function getFormData(){

    let contact = {};

    contact.firstName = document.getElementById("firstName").value;
    let pfirstNameError = document.getElementById("firstNameErrorMsg");

    if(!contact.firstName.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)){
        // let p = document.getElementById("firstNameErrorMsg");
        pfirstNameError.innerText = "veillez entrer un prénom qui ne comporte pas de caractères numériques";
        contact.firstName = "";
    }
    else{
        contact.firstName = document.getElementById("firstName").value;
        pfirstNameError.innerText = "";
    }
    
    contact.lastName = document.getElementById("lastName").value;
    let plastNameError = document.getElementById("lastNameErrorMsg");

    if(!contact.lastName.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)){
        // let p = document.getElementById("lastNameErrorMsg");
        plastNameError.innerText = "veillez entrer un nom qui ne comporte pas de caractères numériques";
        contact.lastName = "";
    }
    else{
        contact.lastName = document.getElementById("lastName").value;
        plastNameError.innerText = "";
    }

    contact.city = document.getElementById("city").value;
    let pCityError = document.getElementById("cityErrorMsg");

    if(!contact.city.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)){
        // let p = document.getElementById("cityErrorMsg");
        pCityError.innerText = "veillez entrer un nom de ville";
        contact.city = "";
    }
    else{
        contact.city = document.getElementById("city").value;
        pCityError.innerText = "";
    }

    contact.address = document.getElementById("address").value;
    let pAddressError = document.getElementById("addressErrorMsg");

    if(!contact.address.match(/^([1-9][0-9]*(?:-[1-9][0-9]*)*)[\s,-]+(?:(bis|ter|qua)[\s,-]+)?([\w]+[\-\w]*)[\s,]+([-\w].+)$/gmiu)){
        // let p = document.getElementById("addressErrorMsg");
        pAddressError.innerText = "veillez entrer une adresse postale valide";
        contact.address = "";
    }
    else{
        contact.address = document.getElementById("address").value;
        pAddressError.innerText = "";
    }
    contact.email = document.getElementById("email").value;
    let pEmailError = document.getElementById("emailErrorMsg");

    if(!contact.email.match(/^([a-z]|[0-9]|\-|\_|\+|\.)+\@([a-z]|[0-9]){2,}\.[a-z]{2,}(\.[a-z]{2,})?$/gm)){
        // let p = document.getElementById("emailErrorMsg");
        pEmailError.innerText = "veillez entrez une adresse email valide";
        contact.email = "";
    }
    else{
        contact.email = document.getElementById("email").value;
        pEmailError.innerText = "";
    }
    if(contact.firstName !=="" && contact.lastName !=="" && contact.city !=="" && contact.address !=="" && contact.email !==""){
        return contact;

    }
    else{
        return false;
    }
    
}

