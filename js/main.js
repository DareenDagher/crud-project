var productNameInput = document.querySelector('#productNameInput');
var productPriceInput = document.querySelector('#productPriceInput');
var productCategoryInput = document.querySelector('#productCategoryInput');
var productDescriptionInput = document.querySelector('#productDescriptionInput');

var productNameError = document.querySelector('#productNameError'); // An optional error message container

var addBtn = document.querySelector('.addBtn');
var tbody = document.querySelector('tbody');
var searchInput = document.querySelector('#search');


let currentEditIndex = null; // Tracks the index of the product being edited


const productsContainer = loadProducts();

displayProduct(productsContainer);


function loadProducts() {
    const storedProducts = localStorage.getItem('myProducts');
    return storedProducts ? JSON.parse(storedProducts) : [];
}



addBtn.addEventListener('click', function () {
    if (validateProductName()) {
        if (addBtn.classList.contains('addBtn')) {
            addProduct();
        } else if (addBtn.classList.contains('saveBtn')) {
            saveChanges();
        }
    }
    
});



searchInput.addEventListener('input', function () {
    searchProduct(searchInput.value); // handle search
})

tbody.addEventListener('click', function (event) {
    deleteProduct(event); // Handle delete 
    updateProduct(event); // Handle update 
});

productNameInput.addEventListener('input', function () {
    validateProductName();
});



function addProduct() {

    var product = {
        name: productNameInput.value,
        price: productPriceInput.value,
        category: productCategoryInput.value,
        description: productDescriptionInput.value
    }
    productsContainer.push(product);


    saveProducts(productsContainer);
    displayProduct(productsContainer);
    clearForm();


}

function clearForm() {
    productNameInput.value = "";
    productPriceInput.value = "";
    productCategoryInput.value = "";
    productDescriptionInput.value = "";

    productNameInput.classList.remove('is-valid', 'is-invalid');
    productNameError.textContent = ''; // Clear error message
}

function displayProduct(productsList) {

    var cartoona = ``;
    for (var i = 0; i < productsList.length; i++) {

        cartoona += `<tr>
                <td>${i + 1}</td>
                <td>${productsList[i].name}</td>
                <td>${productsList[i].price}</td>
                <td>${productsList[i].category}</td>
                <td>${productsList[i].description}</td>
                <td><button class="btn updateBtn w-100 btn-outline-warning">update</button></td>
                <td><button class="btn deleteBtn w-100 btn-outline-danger">delete</button></td>
            </tr>`;

    }
    tbody.innerHTML = cartoona;

}

function saveProducts(productsList) {
    localStorage.setItem('myProducts', JSON.stringify(productsList));
}

function searchProduct(searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    var searchResult = [];
    for (i = 0; i < productsContainer.length; i++) {
        if (productsContainer[i].name.toLowerCase().includes(lowerSearchTerm)) {
            searchResult.push(productsContainer[i]);
        }
    }
    displayProduct(searchResult);

}

function deleteProduct(event) {
    if (event.target.classList.contains('deleteBtn')) {

        const row = event.target.closest('tr'); // Find the row
        const rowIndex = row.rowIndex - 1; // Adjust index for header row

        productsContainer.splice(rowIndex, 1); // Remove product from the array

        saveProducts(productsContainer); // Save updated array to localStorage
        displayProduct(productsContainer); // Refresh table
    }
}


function updateProduct(event) {


    if (event.target.classList.contains('updateBtn')) {
        const row = event.target.closest('tr'); // Find the row
        const rowIndex = row.rowIndex - 1; // Adjust index for header row
        const product = productsContainer[rowIndex]; // Get the product

        // Track the index of the product being edited
        currentEditIndex = rowIndex;

        // Pre-fill the form inputs with the product details
        productNameInput.value = product.name;
        productPriceInput.value = product.price;
        productCategoryInput.value = product.category;
        productDescriptionInput.value = product.description;

        // Change the Add button to a Save button temporarily
        addBtn.textContent = 'Save Changes';
        addBtn.classList.replace('addBtn', 'saveBtn');

    }
}


function saveChanges() {

    if (currentEditIndex !== null) {
        const product = productsContainer[currentEditIndex]; // Get the product


        // Update product details
        product.name = productNameInput.value;
        product.price = productPriceInput.value;
        product.category = productCategoryInput.value;
        product.description = productDescriptionInput.value;

        saveProducts(productsContainer); // Save updated array to localStorage
        displayProduct(productsContainer); // Refresh table
        clearForm(); // Clear the form


        // Reset button to Add Product
        addBtn.textContent = 'Add Product';
        addBtn.classList.replace('saveBtn', 'addBtn');


        currentEditIndex = null;

    }


}

function validateProductName() {
    var productName = productNameInput.value; // Remove leading/trailing spaces

    // Regex pattern: Only allows alphabets, numbers, spaces, and a few common symbols (like - or &)
    var regex = /^[a-zA-Z0-9\s&-]+$/;

    // Remove any previous validation classes
    productNameInput.classList.remove('is-valid', 'is-invalid');
    productNameError.textContent = ''; // Clear error message
    

    // Validate if the name is empty or invalid based on the regex
    if (productName === "") {
        productNameInput.classList.add('is-invalid');
        productNameError.textContent = 'Product name cannot be empty.';
        return false;
    } else if (productName.length < 3) {
        productNameInput.classList.add('is-invalid');
        productNameError.textContent = 'Product name must be at least 3 characters.';

        return false;
    } else if (!regex.test(productName)) {
        productNameInput.classList.add('is-invalid');
        productNameError.textContent = 'Product name contains invalid characters.';

        return false;
    }
    
    productNameInput.classList.add('is-valid');
    
    return true;
    
}
    


    