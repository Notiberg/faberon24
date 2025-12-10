/**
 * Filters Popup Module
 * Handles filter popup with presets and input
 */

let activeFilters = {
  price: null,
  duration: null
};

function initFiltersPopup() {
  const filtersBtn = document.querySelector('.filters-btn');
  const filtersPopup = document.getElementById('filters-popup');
  const filtersOverlay = document.querySelector('.filters-popup-overlay');
  const filtersClose = document.getElementById('filters-popup-close');
  
  const priceInput = document.getElementById('price-input');
  const pricePresets = document.querySelectorAll('.price-preset');
  const durationPresets = document.querySelectorAll('.duration-preset');
  
  const filterReset = document.getElementById('filter-reset');
  const filterApply = document.getElementById('filter-apply');

  // Open filters popup
  if (filtersBtn) {
    filtersBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      filtersPopup.classList.toggle('hidden');
    });
  }

  // Close filters popup
  if (filtersClose) {
    filtersClose.addEventListener('click', () => {
      filtersPopup.classList.add('hidden');
    });
  }

  // Close on overlay click
  if (filtersOverlay) {
    filtersOverlay.addEventListener('click', () => {
      filtersPopup.classList.add('hidden');
    });
  }

  // Close on document click
  document.addEventListener('click', (e) => {
    if (!filtersPopup.contains(e.target) && !filtersBtn.contains(e.target)) {
      filtersPopup.classList.add('hidden');
    }
  });

  // Price input
  if (priceInput) {
    priceInput.addEventListener('input', (e) => {
      const value = parseInt(e.target.value) || 0;
      activeFilters.price = value > 0 ? `${value}-${value}` : null;
      
      // Update preset buttons
      pricePresets.forEach(btn => btn.classList.remove('active'));
      
      applyFilters();
    });
  }

  // Price presets
  pricePresets.forEach(preset => {
    preset.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Update active state
      pricePresets.forEach(btn => btn.classList.remove('active'));
      preset.classList.add('active');
      
      // Update filter
      activeFilters.price = preset.dataset.price;
      
      // Clear input
      if (priceInput) priceInput.value = '';
      
      // Apply filters
      applyFilters();
    });
  });

  // Duration presets
  durationPresets.forEach(preset => {
    preset.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Update active state
      durationPresets.forEach(btn => btn.classList.remove('active'));
      preset.classList.add('active');
      
      // Update filter
      activeFilters.duration = preset.dataset.duration;
      
      // Apply filters
      applyFilters();
    });
  });

  // Reset filters
  if (filterReset) {
    filterReset.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Reset state
      activeFilters.price = null;
      activeFilters.duration = null;
      
      // Reset UI
      if (priceInput) priceInput.value = '';
      pricePresets.forEach(btn => btn.classList.remove('active'));
      durationPresets.forEach(btn => btn.classList.remove('active'));
      
      // Apply filters (show all)
      applyFilters();
    });
  }

  // Apply filters
  if (filterApply) {
    filterApply.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Close popup
      filtersPopup.classList.add('hidden');
    });
  }
}

// Apply filters to services
function applyFilters() {
  const serviceCards = document.querySelectorAll('.service-card');
  let visibleCount = 0;

  serviceCards.forEach(card => {
    let shouldShow = true;

    // Get card data
    const price = parseInt(card.getAttribute('data-service-price')) || 0;
    const duration = parseInt(card.getAttribute('data-duration')) || 0;

    // Check price filter
    if (activeFilters.price) {
      const [minPrice, maxPrice] = activeFilters.price.split('-');
      const min = parseInt(minPrice);
      const max = maxPrice === '+' ? Infinity : parseInt(maxPrice);
      
      if (price < min || price > max) {
        shouldShow = false;
      }
    }

    // Check duration filter
    if (activeFilters.duration) {
      const [minDuration, maxDuration] = activeFilters.duration.split('-');
      const min = parseInt(minDuration);
      const max = maxDuration === '+' ? Infinity : parseInt(maxDuration);
      
      if (duration < min || duration > max) {
        shouldShow = false;
      }
    }

    // Show or hide card
    card.style.display = shouldShow ? 'block' : 'none';
    if (shouldShow) visibleCount++;
  });

  console.log('Filters applied:', activeFilters, 'Visible cards:', visibleCount);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initFiltersPopup();
});
