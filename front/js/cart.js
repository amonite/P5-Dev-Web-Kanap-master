//car.js

console.log("hello");

// document.getElementById('cart__items').innerText = "test !";


function loadData(){
    
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

            fetch("http://localhost:3000/api/products/"+kanapList[k].id)
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
                    // get price
                    let pPrice = document.createElement("p");
                    pPrice.innerText = data.price;
                    div_itemContentDesc.appendChild(pPrice);
                    
                })
                .catch(function(error){
                    console.log("error fetching data !!!!");
            })
            
            // get color
            let pColor = document.createElement("p");
            pColor.innerText = kanapList[k].color;
            div_itemContentDesc.appendChild(pColor);

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

                article.remove();


            });

        }

    }
    else{
        console.log("LS empty !");
    }
}



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

// function getOrderID(contact,products){
//     let res = fetch("http://localhost:3000/api/products/order", {
//         method: "POST",
//         headers: {
//             'Content-Type': "application/json;charset=utf-8"
//         },
//         body: JSON.stringify({contact:contact, products:products}) 
//     });
//     let data = res.json();
//     console.log("order id = "+data.orderId);
//     let input = document.getElementById("order");
//     input.setAttribute("formaction", "./confirmation.html?id="+data.orderId);
    
// }

// orderBtn.addEventListener("click", getOrderID(getFormData, getIDs));

orderBtn.addEventListener("click", async function(e){
    e.preventDefault();
    let contact = getFormData();
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

    // let input = document.getElementById("order");
    // input.setAttribute("formaction", "./confirmation.html?id="+data.orderId);
    // return true;
    //goto confirmation page and pass order id in url
});

function getFormData(){
    let contact = {};

    contact.firstName = document.getElementById("firstName").value;
    if(!contact.firstName.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)){
        let p = document.getElementById("firstNameErrorMsg");
        p.innerText = "veillez entrer un prélastName qui ne comporte pas de caractères numériques";
    }
    
    contact.lastName = document.getElementById("lastName").value;
    if(!contact.lastName.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)){
        let p = document.getElementById("lastNameErrorMsg");
        p.innerText = "veillez entrer un lastName qui ne comporte pas de caractères numériques";
    }

    contact.city = document.getElementById("lastName").value;
    if(!contact.city.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)){
        let p = document.getElementById("cityErrorMsg");
        p.innerText = "veillez entrer un lastName de city";
    }

    contact.address = document.getElementById("address").value;
    if(!contact.address.match(/^([1-9][0-9]*(?:-[1-9][0-9]*)*)[\s,-]+(?:(bis|ter|qua)[\s,-]+)?([\w]+[\-\w]*)[\s,]+([-\w].+)$/gmiu)){
        let p = document.getElementById("addressErrorMsg");
        p.innerText = "veillez entrer une adresse postale valide";
    }
    contact.email = document.getElementById("email").value;
    if(!contact.email.match(/^([a-z]|[0-9]|\-|\_|\+|\.)+\@([a-z]|[0-9]){2,}\.[a-z]{2,}(\.[a-z]{2,})?$/gm)){
        let p = document.getElementById("emailErrorMsg");
        p.innerText = "veillez entrez une adresse email valide";
    }

    return contact;
}

function getCart(){
    let cart = JSON.parse(localStorage.getItem("cart"));
    return cart;
}