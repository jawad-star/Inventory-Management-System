document.addEventListener('DOMContentLoaded', function () {
    var themeToggleButton = document.getElementById('themeToggle');
    var form = document.getElementById('productForm');
    var productNameInput = document.getElementById('productName');
    var productPriceInput = document.getElementById('productPrice');
    var productQuantityInput = document.getElementById('productQuantity');
    var inventoryBody = document.getElementById('inventoryBody');
    var searchInput = document.getElementById('searchInput');
    var sortSelect = document.getElementById('sortSelect');
    var prevPageBtn = document.getElementById('prevPage');
    var nextPageBtn = document.getElementById('nextPage');
    var pageInfo = document.getElementById('pageInfo');
    var modal = document.getElementById('modal');
    var modalDetails = document.getElementById('modalDetails');
    var closeBtn = document.querySelector('.close-btn');
    var inventory = [];
    var itemId = 1;
    var currentPage = 1;
    var itemsPerPage = 5;
    if (form && productNameInput && productPriceInput && productQuantityInput && inventoryBody && searchInput && sortSelect && prevPageBtn && nextPageBtn && pageInfo && modal && modalDetails && closeBtn) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var productName = productNameInput.value.trim();
            var productPrice = parseFloat(productPriceInput.value.trim());
            var productQuantity = parseInt(productQuantityInput.value.trim(), 10);
            // Validation checks by M. Jawad Raza Qadri - 0476181
            if (productName === '') {
                alert('Please enter a product name.');
                return;
            }
            if (isNaN(productPrice) || productPrice <= 0) {
                alert('Please enter a valid price greater than 0.');
                return;
            }
            if (isNaN(productQuantity) || productQuantity <= 0) {
                alert('Please enter a valid quantity greater than 0.');
                return;
            }
            // Create a new inventory item by M. Jawad Raza Qadri - 0476181
            var newItem = {
                id: itemId,
                name: productName,
                price: productPrice,
                quantity: productQuantity
            };
            // Add the new item to the inventory array by M. Jawad Raza Qadri - 0476181
            inventory.push(newItem);
            // Update the table
            updateInventoryTable();
            // Increment item ID and clear inputs by M. Jawad Raza Qadri - 0476181
            itemId++;
            productNameInput.value = '';
            productPriceInput.value = '';
            productQuantityInput.value = '';
        });
        function updateInventoryTable() {
            if (inventoryBody && searchInput && sortSelect && pageInfo) {
                inventoryBody.innerHTML = '';
                var searchTerm_1 = searchInput.value.toLowerCase();
                var sortKey_1 = sortSelect.value;
                // Filter and sort the inventory by M. Jawad Raza Qadri - 0476181
                var filteredInventory = inventory.filter(function (item) {
                    return item.name.toLowerCase().includes(searchTerm_1);
                });
                filteredInventory.sort(function (a, b) {
                    if (sortKey_1 === 'name') {
                        return a.name.localeCompare(b.name);
                    }
                    else if (sortKey_1 === 'price') {
                        return a.price - b.price;
                    }
                    else if (sortKey_1 === 'quantity') {
                        return a.quantity - b.quantity;
                    }
                    else {
                        return a.id - b.id;
                    }
                });
                // Paginate the filtered inventory by M. Jawad Raza Qadri - 0476181
                var startIndex = (currentPage - 1) * itemsPerPage;
                var paginatedItems = filteredInventory.slice(startIndex, startIndex + itemsPerPage);
                // Loop over paginated items and create table rows by M. Jawad Raza Qadri - 0476181
                for (var _i = 0, paginatedItems_1 = paginatedItems; _i < paginatedItems_1.length; _i++) {
                    var item = paginatedItems_1[_i];
                    var row = document.createElement('tr');
                    row.classList.add('fade-in');
                    row.innerHTML = "\n                        <td>".concat(item.id, "</td>\n                        <td>").concat(item.name, "</td>\n                        <td>$").concat(item.price.toFixed(2), "</td>\n                        <td>").concat(item.quantity, "</td>\n                        <td>\n                            <button class=\"btn-details\">View Details</button>\n                            <button class=\"btn-delete\">Delete</button>\n                        </td>\n                    ");
                    inventoryBody.appendChild(row);
                }
                // Update pagination controls by M. Jawad Raza Qadri - 0476181
                if (prevPageBtn) {
                    prevPageBtn.disabled = currentPage === 1;
                }
                if (nextPageBtn) {
                    nextPageBtn.disabled = currentPage * itemsPerPage >= filteredInventory.length;
                }
                if (pageInfo) {
                    pageInfo.textContent = "Page ".concat(currentPage);
                }
            }
        }
        inventoryBody.addEventListener('click', function (event) {
            var target = event.target;
            if (target.classList.contains('btn-details')) {
                var row = target.closest('tr');
                if (row) {
                    var idCell = row.querySelector('td:nth-child(1)');
                    var nameCell = row.querySelector('td:nth-child(2)');
                    var priceCell = row.querySelector('td:nth-child(3)');
                    var quantityCell = row.querySelector('td:nth-child(4)');
                    var itemId_1 = idCell ? idCell.textContent : 'Unknown ID';
                    var itemName = nameCell ? nameCell.textContent : 'Unknown Item';
                    var itemPrice = priceCell ? priceCell.textContent : 'Unknown Price';
                    var itemQuantity = quantityCell ? quantityCell.textContent : 'Unknown Quantity';
                    // Show modal with item details by M. Jawad Raza Qadri - 0476181
                    if (modalDetails) {
                        modalDetails.innerHTML = "\n                            <p><strong>ID:</strong> ".concat(itemId_1, "</p>\n                            <p><strong>Name:</strong> ").concat(itemName, "</p>\n                            <p><strong>Price:</strong> ").concat(itemPrice, "</p>\n                            <p><strong>Quantity:</strong> ").concat(itemQuantity, "</p>\n                        ");
                    }
                    if (modal) {
                        modal.style.display = 'flex';
                    }
                }
            }
            if (target.classList.contains('btn-delete')) {
                var row = target.closest('tr');
                if (row) {
                    var idCell = row.querySelector('td:nth-child(1)');
                    var itemId_2 = parseInt(idCell ? idCell.textContent : '0', 10);
                    // Remove the item from the inventory
                    var itemIndex = inventory.findIndex(function (item) { return item.id === itemId_2; });
                    if (itemIndex !== -1) {
                        inventory.splice(itemIndex, 1);
                        updateInventoryTable();
                    }
                }
            }
        });
        // Close modal  by M. Jawad Raza Qadri - 0476181
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        }
        window.addEventListener('click', function (event) {
            if (modal && event.target === modal) {
                modal.style.display = 'none';
            }
        });
        // Pagination controls  by M. Jawad Raza Qadri - 0476181
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', function () {
                if (currentPage > 1) {
                    currentPage--;
                    updateInventoryTable();
                }
            });
        }
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', function () {
                var filteredInventory = inventory.filter(function (item) {
                    return item.name.toLowerCase().includes(searchInput ? searchInput.value.toLowerCase() : '');
                });
                if (currentPage * itemsPerPage < filteredInventory.length) {
                    currentPage++;
                    updateInventoryTable();
                }
            });
        }
        // Search and sort controls  by M. Jawad Raza Qadri - 0476181
        if (searchInput) {
            searchInput.addEventListener('input', updateInventoryTable);
        }
        if (sortSelect) {
            sortSelect.addEventListener('change', updateInventoryTable);
        }
        // Initial table load  by M. Jawad Raza Qadri - 0476181
        updateInventoryTable();
        // Theme toggle functionality  by M. Jawad Raza Qadri - 0476181
        if (themeToggleButton) {
            var savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
                updateThemeButtonText(savedTheme);
            }
            themeToggleButton.addEventListener('click', function () {
                var currentTheme = document.documentElement.getAttribute('data-theme');
                var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeButtonText(newTheme);
            });
            function updateThemeButtonText(theme) {
                themeToggleButton.textContent = theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode';
            }
        }
    }
});
