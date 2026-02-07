// Trenches Marketplace - CSFloat Style Redesign
// Depends on marketplace-data.js (ITEMS, RARITIES, ITEM_TYPES, COLORS, SEASONS, PROGRAMS, TBUCKS_SVG)

// Toggle filter sections
function toggleFilter(header) {
    var section = header.parentElement;
    section.classList.toggle('collapsed');
}

document.addEventListener('DOMContentLoaded', function () {

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    let filters = {
        search: '',
        priceMin: null,
        priceMax: null,
        types: [],
        colors: [],
        rarities: [],
        seasons: [],
        programs: [],
        category: 'all'
    };

    let sortBy = 'price-asc';

    // -------------------------------------------------------------------------
    // Collection mode detection
    // -------------------------------------------------------------------------

    const urlParams = new URLSearchParams(window.location.search);
    const isCollectionMode = urlParams.get('collection') === 'true';

    function getCollectionIds() {
        try {
            const stored = localStorage.getItem('trenches-collection');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (e) {
            // Silently handle malformed localStorage data
        }
        return [];
    }

    function getBaseItems() {
        if (isCollectionMode) {
            const collectionIds = getCollectionIds();
            return ITEMS.filter(function (item) {
                return collectionIds.indexOf(item.id) !== -1;
            });
        }
        return ITEMS;
    }

    // -------------------------------------------------------------------------
    // Rarity rank map (for sorting)
    // -------------------------------------------------------------------------

    const RARITY_RANK = {
        common: 1,
        uncommon: 2,
        rare: 3,
        epic: 4,
        legendary: 5,
    };

    // -------------------------------------------------------------------------
    // renderFilters() - Build all filter UI
    // -------------------------------------------------------------------------

    function renderFilters() {
        renderTypeFilters();
        renderColorFilters();
        renderRarityFilters();
        renderSeasonFilters();
        renderProgramFilters();
    }

    function renderTypeFilters() {
        var container = document.getElementById('type-filters');
        if (!container) return;

        var html = '';
        for (var i = 0; i < ITEM_TYPES.length; i++) {
            var type = ITEM_TYPES[i];
            var inputId = 'filter-type-' + type.toLowerCase().replace(/\s+/g, '-');
            html += '<label class="filter-checkbox" for="' + inputId + '">'
                  + '<input type="checkbox" id="' + inputId + '" value="' + type + '" data-filter="types">'
                  + '<span class="checkbox-label">' + type + '</span>'
                  + '</label>';
        }
        container.innerHTML = html;
    }

    function renderColorFilters() {
        var container = document.getElementById('color-filters');
        if (!container) return;

        var html = '';
        for (var i = 0; i < COLORS.length; i++) {
            var color = COLORS[i];
            html += '<button class="color-swatch" data-color="' + color.name + '" '
                  + 'style="background:' + color.hex + '" '
                  + 'title="' + color.name + '" '
                  + 'aria-label="Filter by ' + color.name + '">'
                  + '</button>';
        }
        container.innerHTML = html;
    }

    function renderRarityFilters() {
        var container = document.getElementById('rarity-filters');
        if (!container) return;

        var html = '';
        var rarityKeys = Object.keys(RARITIES);
        for (var i = 0; i < rarityKeys.length; i++) {
            var key = rarityKeys[i];
            var rarity = RARITIES[key];
            var inputId = 'filter-rarity-' + key;
            html += '<label class="filter-checkbox" for="' + inputId + '">'
                  + '<input type="checkbox" id="' + inputId + '" value="' + key + '" data-filter="rarities">'
                  + '<span class="rarity-dot" style="background:' + rarity.color + '"></span>'
                  + '<span class="checkbox-label">' + rarity.label + '</span>'
                  + '</label>';
        }
        container.innerHTML = html;
    }

    function renderSeasonFilters() {
        var container = document.getElementById('season-filters');
        if (!container) return;

        var html = '';
        for (var i = 0; i < SEASONS.length; i++) {
            var season = SEASONS[i];
            var shortName = season.replace('Season ', 'S').replace('Pre-Season', 'Pre');
            html += '<button class="toggle-btn" data-season="' + season + '">' + shortName + '</button>';
        }
        container.innerHTML = html;
    }

    function renderProgramFilters() {
        var container = document.getElementById('program-filters');
        if (!container) return;

        var html = '';
        for (var i = 0; i < PROGRAMS.length; i++) {
            var program = PROGRAMS[i];
            var inputId = 'filter-program-' + program.toLowerCase().replace(/\s+/g, '-');
            html += '<label class="filter-checkbox" for="' + inputId + '">'
                  + '<input type="checkbox" id="' + inputId + '" value="' + program + '" data-filter="programs">'
                  + '<span class="checkbox-label">' + program + '</span>'
                  + '</label>';
        }
        container.innerHTML = html;
    }

    // -------------------------------------------------------------------------
    // applyFilters(items) - Returns filtered array
    // -------------------------------------------------------------------------

    function applyFilters(items) {
        return items.filter(function (item) {
            // Search filter
            if (filters.search) {
                var query = filters.search.toLowerCase();
                var nameMatch = item.name.toLowerCase().indexOf(query) !== -1;
                var typeMatch = item.type.toLowerCase().indexOf(query) !== -1;
                var descMatch = item.description.toLowerCase().indexOf(query) !== -1;
                if (!nameMatch && !typeMatch && !descMatch) {
                    return false;
                }
            }

            // Category filter (from category bar)
            if (filters.category && filters.category !== 'all') {
                var categoryMap = {
                    'weapon-skin': 'Weapon Skin',
                    'character-skin': 'Character Skin',
                    'accessory': 'Accessory',
                    'emote': 'Emote'
                };
                if (categoryMap[filters.category] && item.type !== categoryMap[filters.category]) {
                    return false;
                }
            }

            // Price min filter
            if (filters.priceMin !== null && item.price < filters.priceMin) {
                return false;
            }

            // Price max filter
            if (filters.priceMax !== null && item.price > filters.priceMax) {
                return false;
            }

            // Type filter
            if (filters.types.length > 0 && filters.types.indexOf(item.type) === -1) {
                return false;
            }

            // Color filter
            if (filters.colors.length > 0 && filters.colors.indexOf(item.color) === -1) {
                return false;
            }

            // Rarity filter
            if (filters.rarities.length > 0 && filters.rarities.indexOf(item.rarity) === -1) {
                return false;
            }

            // Season filter
            if (filters.seasons.length > 0 && filters.seasons.indexOf(item.season) === -1) {
                return false;
            }

            // Program filter
            if (filters.programs.length > 0 && filters.programs.indexOf(item.program) === -1) {
                return false;
            }

            return true;
        });
    }

    // -------------------------------------------------------------------------
    // applySorting(items) - Returns sorted copy
    // -------------------------------------------------------------------------

    function applySorting(items) {
        var sorted = items.slice();

        switch (sortBy) {
            case 'price-asc':
                sorted.sort(function (a, b) {
                    return a.price - b.price;
                });
                break;

            case 'price-desc':
                sorted.sort(function (a, b) {
                    return b.price - a.price;
                });
                break;

            case 'name-asc':
                sorted.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });
                break;

            case 'rarity-desc':
                sorted.sort(function (a, b) {
                    var rankA = RARITY_RANK[a.rarity] || 0;
                    var rankB = RARITY_RANK[b.rarity] || 0;
                    return rankB - rankA;
                });
                break;

            case 'newest':
                sorted.reverse();
                break;

            default:
                break;
        }

        return sorted;
    }

    // -------------------------------------------------------------------------
    // makeMarketplaceCard(item) - CSFloat-style card
    // -------------------------------------------------------------------------

    function makeMarketplaceCard(item) {
        var rarity = RARITIES[item.rarity] || RARITIES.common;
        var isLegendary = item.rarity === 'legendary';
        var rarityPercent = (RARITY_RANK[item.rarity] / 5) * 100;

        // Generate a fake "discount" percentage for visual effect
        var discount = Math.floor(Math.random() * 30) + 50;

        // Generate fake expiry time
        var hours = Math.floor(Math.random() * 24);
        var mins = Math.floor(Math.random() * 60);
        var secs = Math.floor(Math.random() * 60);
        var expiry = String(hours).padStart(2, '0') + ':' + String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');

        return '<a href="marketplace-item.html?id=' + encodeURIComponent(item.id) + '" class="mp-card">'
             // Header
             + '<div class="mp-card-header">'
             + '<div class="mp-card-name' + (isLegendary ? ' legendary' : '') + '">' + escapeHtml(item.name) + '</div>'
             + '<div class="mp-card-type">' + escapeHtml(item.type) + '</div>'
             + '</div>'
             // Image area
             + '<div class="mp-card-image" style="background:' + rarity.bg + '">'
             + '<span class="mp-card-item-visual">' + item.emoji + '</span>'
             + '<div class="mp-card-actions">'
             + '<button class="mp-card-action" onclick="event.preventDefault();" title="Add to wishlist">'
             + '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
             + '</button>'
             + '<button class="mp-card-action" onclick="event.preventDefault();" title="Quick view">'
             + '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>'
             + '</button>'
             + '</div>'
             + '</div>'
             // Info section
             + '<div class="mp-card-info">'
             + '<div class="mp-card-price-row">'
             + '<span class="mp-card-price"><span class="tbucks-icon">' + TBUCKS_SVG + '</span>' + item.price.toLocaleString() + '</span>'
             + '<span class="mp-card-discount">' + discount + '%</span>'
             + '</div>'
             + '<div class="mp-card-rarity-bar" style="background: var(--wear-gradient)">'
             + '<div class="mp-card-rarity-bar-marker" style="left:' + rarityPercent + '%"></div>'
             + '</div>'
             + '<div class="mp-card-meta">'
             + '<span class="mp-card-rarity" style="color:' + rarity.color + '">'
             + '<span class="rarity-dot" style="background:' + rarity.color + '"></span>'
             + rarity.label
             + '</span>'
             + '<span class="mp-card-stat">' + item.season + '</span>'
             + '</div>'
             + '</div>'
             // Footer
             + '<div class="mp-card-footer">'
             + '<span class="mp-card-status">Available</span>'
             + '<span class="mp-card-expires">Expires in ' + expiry + '</span>'
             + '</div>'
             + '</a>';
    }

    // -------------------------------------------------------------------------
    // Utility: escapeHtml - Prevent XSS from item data
    // -------------------------------------------------------------------------

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // -------------------------------------------------------------------------
    // renderGrid() - Main render function
    // -------------------------------------------------------------------------

    function renderGrid() {
        var grid = document.getElementById('marketplace-grid');
        var resultsCount = document.getElementById('results-count');
        if (!grid) return;

        // Get base items (all or collection-filtered)
        var baseItems = getBaseItems();

        // Apply user filters
        var filtered = applyFilters(baseItems);

        // Apply sorting
        var sorted = applySorting(filtered);

        // Update results count
        if (resultsCount) {
            var totalCount = baseItems.length;
            var shownCount = sorted.length;
            if (shownCount === totalCount) {
                resultsCount.textContent = shownCount + ' item' + (shownCount !== 1 ? 's' : '');
            } else {
                resultsCount.textContent = shownCount + ' of ' + totalCount + ' item' + (totalCount !== 1 ? 's' : '');
            }
        }

        // Generate HTML
        if (sorted.length === 0) {
            grid.innerHTML = '<div class="marketplace-empty">'
                           + '<div class="marketplace-empty-icon">&#128269;</div>'
                           + '<p class="marketplace-empty-text">No items found. Try adjusting your filters or search terms.</p>'
                           + '</div>';
            return;
        }

        var html = '';
        for (var i = 0; i < sorted.length; i++) {
            html += makeMarketplaceCard(sorted[i]);
        }
        grid.innerHTML = html;
    }

    // -------------------------------------------------------------------------
    // Event listeners
    // -------------------------------------------------------------------------

    // Search input
    var searchInput = document.getElementById('marketplace-search');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            filters.search = this.value.trim();
            renderGrid();
        });
    }

    // Price min
    var priceMinInput = document.getElementById('price-min');
    if (priceMinInput) {
        priceMinInput.addEventListener('input', function () {
            var val = parseFloat(this.value);
            filters.priceMin = isNaN(val) ? null : val;
            renderGrid();
        });
    }

    // Price max
    var priceMaxInput = document.getElementById('price-max');
    if (priceMaxInput) {
        priceMaxInput.addEventListener('input', function () {
            var val = parseFloat(this.value);
            filters.priceMax = isNaN(val) ? null : val;
            renderGrid();
        });
    }

    // Price quick filters
    var priceQuickBtns = document.querySelectorAll('.price-quick-btn');
    priceQuickBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var min = this.dataset.min ? parseFloat(this.dataset.min) : null;
            var max = this.dataset.max ? parseFloat(this.dataset.max) : null;

            // Toggle active state
            var wasActive = this.classList.contains('active');
            priceQuickBtns.forEach(function(b) { b.classList.remove('active'); });

            if (wasActive) {
                filters.priceMin = null;
                filters.priceMax = null;
                if (priceMinInput) priceMinInput.value = '';
                if (priceMaxInput) priceMaxInput.value = '';
            } else {
                this.classList.add('active');
                filters.priceMin = min;
                filters.priceMax = max;
                if (priceMinInput) priceMinInput.value = min || '';
                if (priceMaxInput) priceMaxInput.value = max || '';
            }

            renderGrid();
        });
    });

    // Category bar buttons
    var categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            filters.category = this.dataset.category;
            renderGrid();
        });
    });

    // Checkbox filters (types, rarities, programs)
    function handleCheckboxChange(e) {
        var checkbox = e.target;
        if (checkbox.type !== 'checkbox' || !checkbox.dataset.filter) return;

        var filterKey = checkbox.dataset.filter;
        var value = checkbox.value;

        if (!filters[filterKey]) return;

        if (checkbox.checked) {
            if (filters[filterKey].indexOf(value) === -1) {
                filters[filterKey].push(value);
            }
        } else {
            var idx = filters[filterKey].indexOf(value);
            if (idx !== -1) {
                filters[filterKey].splice(idx, 1);
            }
        }

        renderGrid();
    }

    var filterContainerIds = ['type-filters', 'rarity-filters', 'program-filters'];
    for (var i = 0; i < filterContainerIds.length; i++) {
        var container = document.getElementById(filterContainerIds[i]);
        if (container) {
            container.addEventListener('change', handleCheckboxChange);
        }
    }

    // Season toggle buttons
    var seasonContainer = document.getElementById('season-filters');
    if (seasonContainer) {
        seasonContainer.addEventListener('click', function(e) {
            var btn = e.target.closest('.toggle-btn');
            if (!btn) return;

            var season = btn.dataset.season;
            btn.classList.toggle('active');

            var idx = filters.seasons.indexOf(season);
            if (idx === -1) {
                filters.seasons.push(season);
            } else {
                filters.seasons.splice(idx, 1);
            }

            renderGrid();
        });
    }

    // Color swatch filters (click delegation)
    var colorContainer = document.getElementById('color-filters');
    if (colorContainer) {
        colorContainer.addEventListener('click', function (e) {
            var swatch = e.target.closest('.color-swatch');
            if (!swatch) return;

            var colorName = swatch.dataset.color;
            if (!colorName) return;

            // Toggle active class
            swatch.classList.toggle('active');

            // Toggle value in filters array
            var idx = filters.colors.indexOf(colorName);
            if (idx === -1) {
                filters.colors.push(colorName);
            } else {
                filters.colors.splice(idx, 1);
            }

            renderGrid();
        });
    }

    // Sort select
    var sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            sortBy = this.value;
            renderGrid();
        });
    }

    // Reset filters button
    var resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            // Reset filter state
            filters.search = '';
            filters.priceMin = null;
            filters.priceMax = null;
            filters.types = [];
            filters.colors = [];
            filters.rarities = [];
            filters.seasons = [];
            filters.programs = [];
            filters.category = 'all';

            // Clear search input
            if (searchInput) {
                searchInput.value = '';
            }

            // Clear price inputs
            if (priceMinInput) {
                priceMinInput.value = '';
            }
            if (priceMaxInput) {
                priceMaxInput.value = '';
            }

            // Uncheck all checkboxes
            var allCheckboxes = document.querySelectorAll('[data-filter] input[type="checkbox"], input[data-filter]');
            for (var i = 0; i < allCheckboxes.length; i++) {
                allCheckboxes[i].checked = false;
            }

            // Remove .active from all color swatches
            var allSwatches = document.querySelectorAll('.color-swatch.active');
            for (var j = 0; j < allSwatches.length; j++) {
                allSwatches[j].classList.remove('active');
            }

            // Remove .active from toggle buttons
            var allToggles = document.querySelectorAll('.toggle-btn.active, .price-quick-btn.active');
            for (var k = 0; k < allToggles.length; k++) {
                allToggles[k].classList.remove('active');
            }

            // Reset category bar
            categoryBtns.forEach(function(b) { b.classList.remove('active'); });
            var allItemsBtn = document.querySelector('.category-btn[data-category="all"]');
            if (allItemsBtn) allItemsBtn.classList.add('active');

            // Reset sort to default
            sortBy = 'price-asc';
            if (sortSelect) {
                sortSelect.value = 'price-asc';
            }

            renderGrid();
        });
    }

    // Refresh button
    var refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            renderGrid();
        });
    }

    // Content tabs (All Items, Hot Deals, New Listings)
    var contentTabs = document.querySelectorAll('.content-tab');
    contentTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            contentTabs.forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            // For now, just re-render (could implement different views)
            renderGrid();
        });
    });

    // -------------------------------------------------------------------------
    // Navbar scroll effect
    // -------------------------------------------------------------------------

    var nav = document.querySelector('.main-nav');
    if (nav) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                nav.style.background = 'rgb(21, 23, 28)';
            } else {
                nav.style.background = 'rgb(21, 23, 28)';
            }
        });
    }

    // -------------------------------------------------------------------------
    // Collection mode header adjustments
    // -------------------------------------------------------------------------

    if (isCollectionMode) {
        // Change page title
        document.title = 'My Collection | Our Trenches';

        // Hide the "My Collection" sidebar button
        var collectionLinks = document.querySelectorAll('a[href*="collection=true"], .my-collection-btn');
        for (var k = 0; k < collectionLinks.length; k++) {
            collectionLinks[k].style.display = 'none';
        }

        // Update results count label
        var resultsLabel = document.getElementById('results-count');
        if (resultsLabel) {
            resultsLabel.parentElement.innerHTML = '<strong style="color: var(--csfloat-text-white);">My Collection</strong> &mdash; <span id="results-count">0 items</span>';
        }
    }

    // -------------------------------------------------------------------------
    // Initialize
    // -------------------------------------------------------------------------

    renderFilters();
    renderGrid();

});
