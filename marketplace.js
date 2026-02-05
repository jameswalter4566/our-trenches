// Trenches Marketplace - Main JavaScript
// Depends on marketplace-data.js (ITEMS, RARITIES, ITEM_TYPES, COLORS, SEASONS, PROGRAMS, TBUCKS_SVG)

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
            var inputId = 'filter-season-' + season.toLowerCase().replace(/\s+/g, '-');
            html += '<label class="filter-checkbox" for="' + inputId + '">'
                  + '<input type="checkbox" id="' + inputId + '" value="' + season + '" data-filter="seasons">'
                  + '<span class="checkbox-label">' + season + '</span>'
                  + '</label>';
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
    // makeMarketplaceCard(item) - Returns HTML string for one card
    // -------------------------------------------------------------------------

    function makeMarketplaceCard(item) {
        var rarity = RARITIES[item.rarity] || RARITIES.common;

        return '<a href="marketplace-item.html?id=' + encodeURIComponent(item.id) + '" class="mp-card">'
             + '<div class="mp-card-rarity-stripe" style="background:' + rarity.color + '"></div>'
             + '<div class="mp-card-image" style="background:' + rarity.bg + '">'
             + '<span class="mp-card-item-visual">' + item.emoji + '</span>'
             + '</div>'
             + '<div class="mp-card-info">'
             + '<div class="mp-card-name">' + escapeHtml(item.name) + '</div>'
             + '<div class="mp-card-type">' + escapeHtml(item.type) + '</div>'
             + '<div class="mp-card-meta">'
             + '<span class="mp-card-rarity" style="color:' + rarity.color + '">'
             + '<span class="rarity-dot" style="background:' + rarity.color + '"></span>'
             + rarity.label
             + '</span>'
             + '<span class="mp-card-price">'
             + '<span class="tbucks-icon">' + TBUCKS_SVG + '</span>'
             + item.price.toLocaleString()
             + '</span>'
             + '</div>'
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
            grid.innerHTML = '<div class="mp-empty-state">'
                           + '<div class="mp-empty-icon">&#128269;</div>'
                           + '<h3 class="mp-empty-title">No items found</h3>'
                           + '<p class="mp-empty-text">Try adjusting your filters or search terms.</p>'
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

    // Checkbox filters (types, rarities, seasons, programs)
    // Uses event delegation on the filter containers
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

    var filterContainerIds = ['type-filters', 'rarity-filters', 'season-filters', 'program-filters'];
    for (var i = 0; i < filterContainerIds.length; i++) {
        var container = document.getElementById(filterContainerIds[i]);
        if (container) {
            container.addEventListener('change', handleCheckboxChange);
        }
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

            // Reset sort to default
            sortBy = 'price-asc';
            if (sortSelect) {
                sortSelect.value = 'price-asc';
            }

            renderGrid();
        });
    }

    // -------------------------------------------------------------------------
    // Navbar scroll effect
    // -------------------------------------------------------------------------

    var nav = document.querySelector('.main-nav');
    if (nav) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(10, 22, 40, 0.98)';
            } else {
                nav.style.background = 'rgba(10, 22, 40, 0.85)';
            }
        });
    }

    // -------------------------------------------------------------------------
    // Collection mode header adjustments
    // -------------------------------------------------------------------------

    if (isCollectionMode) {
        // Change marketplace title to "My Collection"
        var marketplaceTitle = document.querySelector('.marketplace-title, .mp-title, h1');
        if (marketplaceTitle) {
            marketplaceTitle.textContent = 'My Collection';
        }

        // Update page document title
        document.title = 'My Collection | Our Trenches';

        // Hide the "My Collection" sidebar/nav button
        var collectionLinks = document.querySelectorAll('a[href*="collection=true"], .collection-btn, .my-collection-btn');
        for (var k = 0; k < collectionLinks.length; k++) {
            collectionLinks[k].style.display = 'none';
        }
    }

    // -------------------------------------------------------------------------
    // Initialize
    // -------------------------------------------------------------------------

    renderFilters();
    renderGrid();

});
