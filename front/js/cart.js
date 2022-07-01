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

        }

    }
    else{
        console.log("LS empty !");
    }
}



loadData();

// function getNewData(){
//     let items = document.getElementsByClassName("cart__item");
//     let ids = [];
//     let kanap = {};
//     for(i=0; i<items.length; i++){
//         ids[i] = items[i].getAttribute("data-id");
//         console.log("ids = "+ids[i]);
//     }
// }

// getNewData();