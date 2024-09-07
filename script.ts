document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('themeToggle') as HTMLButtonElement | null;
    const form = document.getElementById('productForm') as HTMLFormElement | null;
    const productNameInput = document.getElementById('productName') as HTMLInputElement | null;
    const productPriceInput = document.getElementById('productPrice') as HTMLInputElement | null;
    const productQuantityInput = document.getElementById('productQuantity') as HTMLInputElement | null;
    const inventoryBody = document.getElementById('inventoryBody') as HTMLTableSectionElement | null;
    const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
    const sortSelect = document.getElementById('sortSelect') as HTMLSelectElement | null;
    const prevPageBtn = document.getElementById('prevPage') as HTMLButtonElement | null;
    const nextPageBtn = document.getElementById('nextPage') as HTMLButtonElement | null;
    const pageInfo = document.getElementById('pageInfo') as HTMLSpanElement | null;
    const modal = document.getElementById('modal') as HTMLDivElement | null;
    const modalDetails = document.getElementById('modalDetails') as HTMLDivElement | null;
    const closeBtn = document.querySelector('.close-btn') as HTMLSpanElement | null;

    interface InventoryItem {
        id: number;
        name: string;
        price: number;
        quantity: number;
    }

    const inventory: InventoryItem[] = [];
    let itemId = 1;
    let currentPage = 1;
    const itemsPerPage = 5;

    if (form && productNameInput && productPriceInput && productQuantityInput && inventoryBody && searchInput && sortSelect && prevPageBtn && nextPageBtn && pageInfo && modal && modalDetails && closeBtn) {
        form.addEventListener('submit', (event: Event) => {
            event.preventDefault();

            const productName = productNameInput.value.trim();
            const productPrice = parseFloat(productPriceInput.value.trim());
            const productQuantity = parseInt(productQuantityInput.value.trim(), 10);

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
            const newItem: InventoryItem = {
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

        function updateInventoryTable(): void {
            if (inventoryBody && searchInput && sortSelect && pageInfo) {
                inventoryBody.innerHTML = '';
                const searchTerm = searchInput.value.toLowerCase();
                const sortKey = sortSelect.value;

                // Filter and sort the inventory by M. Jawad Raza Qadri - 0476181
                const filteredInventory = inventory.filter(item => 
                    item.name.toLowerCase().includes(searchTerm)
                );

                filteredInventory.sort((a, b) => {
                    if (sortKey === 'name') {
                        return a.name.localeCompare(b.name);
                    } else if (sortKey === 'price') {
                        return a.price - b.price;
                    } else if (sortKey === 'quantity') {
                        return a.quantity - b.quantity;
                    } else {
                        return a.id - b.id;
                    }
                });
 
                // Paginate the filtered inventory by M. Jawad Raza Qadri - 0476181
                const startIndex = (currentPage - 1) * itemsPerPage;
                const paginatedItems = filteredInventory.slice(startIndex, startIndex + itemsPerPage);

                // Loop over paginated items and create table rows by M. Jawad Raza Qadri - 0476181
                for (const item of paginatedItems) {
                    const row = document.createElement('tr');
                    row.classList.add('fade-in');
                    row.innerHTML = `
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>${item.quantity}</td>
                        <td>
                            <button class="btn-details">View Details</button>
                            <button class="btn-delete">Delete</button>
                        </td>
                    `;
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
                    pageInfo.textContent = `Page ${currentPage}`;
                }
            }
        }

        inventoryBody.addEventListener('click', (event: Event) => {
            const target = event.target as HTMLElement;

            if (target.classList.contains('btn-details')) {
                const row = target.closest('tr') as HTMLTableRowElement;
                if (row) {
                    const idCell = row.querySelector('td:nth-child(1)');
                    const nameCell = row.querySelector('td:nth-child(2)');
                    const priceCell = row.querySelector('td:nth-child(3)');
                    const quantityCell = row.querySelector('td:nth-child(4)');

                    const itemId = idCell ? idCell.textContent : 'Unknown ID';
                    const itemName = nameCell ? nameCell.textContent : 'Unknown Item';
                    const itemPrice = priceCell ? priceCell.textContent : 'Unknown Price';
                    const itemQuantity = quantityCell ? quantityCell.textContent : 'Unknown Quantity';

                    // Show modal with item details by M. Jawad Raza Qadri - 0476181
                    if (modalDetails) { 
                        modalDetails.innerHTML = `
                            <p><strong>ID:</strong> ${itemId}</p>
                            <p><strong>Name:</strong> ${itemName}</p>
                            <p><strong>Price:</strong> ${itemPrice}</p>
                            <p><strong>Quantity:</strong> ${itemQuantity}</p>
                        `;
                    }
                    if (modal) {
                        modal.style.display = 'flex';
                    }
                }
            }

            if (target.classList.contains('btn-delete')) {
                const row = target.closest('tr') as HTMLTableRowElement;
                if (row) {
                    const idCell = row.querySelector('td:nth-child(1)');
                    const itemId = parseInt(idCell ? idCell.textContent : '0', 10);

                    // Remove the item from the inventory
                    const itemIndex = inventory.findIndex(item => item.id === itemId);
                    if (itemIndex !== -1) {
                        inventory.splice(itemIndex, 1);
                        updateInventoryTable();
                    }
                }
            }
        });

        // Close modal  by M. Jawad Raza Qadri - 0476181
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        }

        window.addEventListener('click', (event: MouseEvent) => {
            if (modal && event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Pagination controls  by M. Jawad Raza Qadri - 0476181
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateInventoryTable();
                }
            });
        }

        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                const filteredInventory = inventory.filter(item => 
                    item.name.toLowerCase().includes(searchInput ? searchInput.value.toLowerCase() : '')
                );
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
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
                updateThemeButtonText(savedTheme);
            }

            themeToggleButton.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeButtonText(newTheme);
            });

            function updateThemeButtonText(theme: string): void {
                themeToggleButton.textContent = theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode';
            }
        }
    }
});
