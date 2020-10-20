async function getDevs() {
    function getDevsJson() {
        return fetch("../backend/devs.json");
    }

    function decodeJson(json) {
        return json.json();
    }

    const devsJson = await getDevsJson();
    const devs = await decodeJson(devsJson);

    return devs;
}

async function start() {
    const devs = await getDevs();

    createDevsGrid(devs.devs);

    const input = document.getElementById("nameSearch");
    input.addEventListener('keyup', applyFilters);

    const elements = document.getElementsByName("languageSearch");
    const elementsArray = Array.from(elements);
    for (let element of elementsArray) {
        element.addEventListener('click', applyFilters);
    }
}

async function applyFilters() {
    let devs = await getDevs();
    devs = devs.devs;

    devs = filterDevsByName(devs);
    devs = filterDevsByLanguage(devs);

    createDevsGrid(devs);
}

function filterDevsByLanguage(devs) {
    const checkbox = getCheckedCheckboxes();
    const radio = getCheckedRadio();
    let filter = devs;

    filter = devs.filter(element => {
        let arrayDevLanguages = [];

        for (let language of element.programmingLanguages) {
            arrayDevLanguages.push(language.id);
        }

        if (radio === "and") {
            if (checkbox.length != arrayDevLanguages.length){
                return false;
            }

            for (let i in checkbox) {
                if (checkbox[i] !== arrayDevLanguages[i]) {
                    return false
                }
            }

            return true;
        } else {
            return checkbox.some((language) => {
                for (let devLanguage of arrayDevLanguages) {
                    if(language === devLanguage) {
                        return true;
                    }
                }
            });
        }
    });
    
    console.log(filter);
    return filter;
}

function getCheckedCheckboxes() {
    const elements = document.getElementsByClassName("languageCheckbox");
    const elementsArray = Array.from(elements);

    const checkboxes = elementsArray.filter(element => {
        return element.checked === true;
    });

    let arrayReturn = [];

    if (checkboxes.length > 0) {
        for (let checkbox of checkboxes) {
            arrayReturn.push(checkbox.id);
        }
    }

    return arrayReturn;
}

function getCheckedRadio() {
    const radios = document.getElementsByClassName("languageRadio");
    const radiosArray = Array.from(radios);

    const radio = radiosArray.filter(element => {
        return element.checked === true;
    });

    return radio[0].id;
}

function filterDevsByName(devs) {
    const input = document.getElementById("nameSearch");
    const name = input.value.replaceAll(" ", "").toLowerCase();
    let filter = devs;

    if (name !== "") {
        filter = devs.filter(dev => {
            let devName = dev.name.replaceAll(" ", "");
            devName = devName.toLowerCase();
            devName = devName.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            
            if (devName.indexOf(name) != -1) {
                return dev;
            }
        });
    }

    return filter;
}

function createDevsGrid(devs) {
    const grid = document.getElementById("devsGrid");
    grid.innerHTML = "";

    countDevs = devs.length;
    replaceText(countDevs);

    for (let dev of devs) {
        const outerDiv = createOuterDiv();
        const cardDiv = createCardDiv();
        
        const cardImage = createCardImage(dev.picture);
        const cardContent = createCardContent(dev.name, dev.programmingLanguages);

        cardDiv.appendChild(cardImage);
        cardDiv.appendChild(cardContent);
        outerDiv.appendChild(cardDiv);
        grid.appendChild(outerDiv);
    }
}

function createOuterDiv() {
    const outerDiv = document.createElement("div");
    outerDiv.classList.add("col", "s4");

    return outerDiv;
}

function createCardDiv() {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "horizontal");

    return cardDiv;
}

function createCardImage(picture) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card-image");

    const image = document.createElement("img");
    image.src = picture;

    cardDiv.appendChild(image);

    return cardDiv;
}

function createCardContent(name, languages) {
    const stackedDiv = document.createElement("div");
    stackedDiv.classList.add("card-stacked");

    const nameDiv = createCardContentName(name);
    const languagesDiv = createCardContentLanguages(languages);
    
    stackedDiv.appendChild(nameDiv);
    stackedDiv.appendChild(languagesDiv);

    return stackedDiv;
}

function createCardContentName(name) {
    contentDiv = document.createElement("div");
    contentDiv.classList.add("card-content", "resizeFont");
    contentDiv.textContent = name;

    return contentDiv;
}

function createCardContentLanguages(languages) {
    const languagesDiv = document.createElement("div");
    languagesDiv.classList.add("card-action");
    
    for (let language of languages) {
        const img = document.createElement("img");
        img.classList.add("resizeImg");
        img.src = "./images/" + language.id.toLowerCase() + ".png";

        languagesDiv.appendChild(img);
    }

    return languagesDiv;
}

function replaceText(countDevs) {
    const h3 = document.getElementById("devsFound");
    h3.textContent = makeText(countDevs);
}

function makeText(count) {
    let string = "";

    if (count > 1) {
        string = count + " dev(s) encontrado(s)";
    } else if (count === 1) {
        string = count + " dev encontrado";
    } else {
        string = "Nenhum dev encontrado.";
    }

    return string;
}

start();
