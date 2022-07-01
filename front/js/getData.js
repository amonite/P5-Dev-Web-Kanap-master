// load les canapés

/***********************************************************************************************/
/* Fetch request                                                                               */
/***********************************************************************************************/


function getData(){

    fetch("http://localhost:3000/api/products")
        .then(function(res){
            if(res.ok){
                return res.json();
            }
        })
        .then(function(data){
            //console.log(data); //debug
           
            for(i=0;i<data.length;i++){

                /*<!-- <a href="./product.html?id=42">
                    <article>
                    <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
                    <h3 class="productName">Kanap name1</h3>
                    <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
                    </article>
                </a> -->*/

                let element = document.createElement("a");
                element.setAttribute("href", "./product.html?id="+data[i]._id);

                let article = document.createElement("article");
                element.appendChild(article);

                let img = document.createElement("img");
                img.setAttribute("src", data[i].imageUrl);
                img.setAttribute("alt", data[i].altTxt);
                article.appendChild(img);

                let h3 = document.createElement("h3");
                h3.classList.add("productName");
                h3.innerText = data[i].name;
                article.appendChild(h3);

                let p = document.createElement("p");
                p.classList.add("productDescription");
                p.innerText = data[i].description;
                article.appendChild(p);

                let items = document.getElementById("items");
                items.appendChild(element);

            }
            
        })
        .catch(function(error){
            console.log("punaise ! " + error);
        })

}

getData();



