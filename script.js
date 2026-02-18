let products = [];
let config = {};
let currentIndex = 0;
const batchSize = 10;

const productList = document.getElementById("productList");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("productModal");

async function loadData() {
    const productRes = await fetch("data/products.json");
    products = await productRes.json();

    const configRes = await fetch("data/config.json");
    config = await configRes.json();

    document.getElementById("companyName").innerText = config.company_name;
    document.getElementById("footerAddress").innerText = config.address;

    renderProducts();
}

function renderProducts() {
    const nextBatch = products.slice(currentIndex, currentIndex + batchSize);

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

    if (currentIndex >= products.length) {
        loadMoreBtn.style.display = "none";
    }
}

function openModal(product) {
    document.getElementById("modalImage").src = product.image;
    document.getElementById("modalName").innerText = product.name;
    document.getElementById("modalComposition").innerText = product.composition;
    document.getElementById("modalDetails").innerText = product.details || "";
    document.getElementById("modalAddress").innerText = config.address;

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

loadMoreBtn.onclick = renderProducts;

searchInput.addEventListener("input", function() {
    const value = this.value.toLowerCase();
    productList.innerHTML = "";
    currentIndex = 0;

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(value) ||
        p.composition.toLowerCase().includes(value)
    );

    products = filtered;
    renderProducts();
});

loadData();
