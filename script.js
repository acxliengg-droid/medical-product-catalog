let allProducts = [];
let filteredProducts = [];
let config = {};
let currentIndex = 0;
const batchSize = 10;

const productList = document.getElementById("productList");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("productModal");
const endText = document.getElementById("endText");

async function loadData() {
    const productRes = await fetch("data/products.json");
    allProducts = await productRes.json();
    filteredProducts = [...allProducts];

    const configRes = await fetch("data/config.json");
    config = await configRes.json();

    document.getElementById("companyName").innerText = config.company_name || "My Company";
    document.getElementById("footerAddress").innerText = config.address || "New Delhi, India";
    document.getElementById("modalAddress").innerText = config.address || "New Delhi, India";

    renderProducts();
}

function renderProducts(reset = false) {

    if (reset) {
        productList.innerHTML = "";
        currentIndex = 0;
        endText.innerText = "";
    }

    const nextBatch = filteredProducts.slice(currentIndex, currentIndex + batchSize);

    nextBatch.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" loading="lazy">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="composition">${product.composition}</p>
            </div>
        `;

        card.onclick = () => openModal(product);
        productList.appendChild(card);
    });

    currentIndex += batchSize;

    if (currentIndex >= filteredProducts.length) {
        loadMoreBtn.style.display = "none";
        endText.innerText = "You Have Reached The End.";
    } else {
        loadMoreBtn.style.display = "block";
        endText.innerText = "";
    }
}

function openModal(product) {
    document.getElementById("modalImage").src = product.image;
    document.getElementById("modalName").innerText = product.name;
    document.getElementById("modalComposition").innerText = product.composition;
    document.getElementById("modalDetails").innerText = product.details || "";

    if (product.mrp) {
        document.getElementById("modalMRP").innerText = "MRP: " + product.mrp;
        document.getElementById("modalMRP").style.display = "block";
    } else {
        document.getElementById("modalMRP").style.display = "none";
    }

    document.getElementById("callBtn").href = `tel:${config.call}`;
    document.getElementById("whatsappBtn").href = `https://wa.me/${config.whatsapp}`;
    document.getElementById("emailBtn").href = `mailto:${config.email}`;

    modal.classList.add("show");
}

document.getElementById("closeModal").onclick = () => {
    modal.classList.remove("show");
};

loadMoreBtn.onclick = () => renderProducts();

searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase();

    filteredProducts = allProducts.filter(p =>
        p.name.toLowerCase().includes(value) ||
        p.composition.toLowerCase().includes(value)
    );

    renderProducts(true);
});

loadData();
