/**
 * Filters Popup Module
 * Handles filter popup and filtering logic
 */

let activeFilters = {
  price: null,
  duration: null
};

// Initialize filters popup
function initFiltersPopup() {
  const filtersBtn = document.querySelector('.filters-btn');
  const filtersPopup = document.getElementById('filters-popup');
  const filtersOverlay = document.querySelector('.filters-popup-overlay');
  const filterAllBtn = document.getElementById('filter-all');
  
  const priceDropdownBtn = document.getElementById('price-dropdown-btn');
  const priceDropdownMenu = document.getElementById('price-dropdown-menu');
  const priceOptions = priceDropdownMenu.querySelectorAll('.filter-option');
  
  const durationDropdownBtn = document.getElementById('duration-dropdown-btn');
  const durationDropdownMenu = document.getElementById('duration-dropdown-menu');
  const durationOptions = durationDropdownMenu.querySelectorAll('.filter-option');

  // Open filters popup
  if (filtersBtn) {
    filtersBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      filtersPopup.classList.toggle('hidden');
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

  // Price dropdown toggle
  if (priceDropdownBtn) {
    priceDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      priceDropdownMenu.classList.toggle('hidden');
      durationDropdownMenu.classList.add('hidden');
      priceDropdownBtn.classList.toggle('active');
      durationDropdownBtn.classList.remove('active');
    });
  }

  // Price options
  priceOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Update active state
      priceOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      
      // Update filter
      activeFilters.price = option.dataset.price;
      
      // Update button label
      priceDropdownBtn.querySelector('.filter-label').textContent = option.textContent;
      
      // Close menu
      priceDropdownMenu.classList.add('hidden');
      priceDropdownBtn.classList.remove('active');
      
      // Apply filters
      applyFilters();
    });
  });

  // Duration dropdown toggle
  if (durationDropdownBtn) {
    durationDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      durationDropdownMenu.classList.toggle('hidden');
      priceDropdownMenu.classList.add('hidden');
      durationDropdownBtn.classList.toggle('active');
      priceDropdownBtn.classList.remove('active');
    });
  }

  // Duration options
  durationOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Update active state
      durationOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      
      // Update filter
      activeFilters.duration = option.dataset.duration;
      
      // Update button label
      durationDropdownBtn.querySelector('.filter-label').textContent = option.textContent;
      
      // Close menu
      durationDropdownMenu.classList.add('hidden');
      durationDropdownBtn.classList.remove('active');
      
      // Apply filters
      applyFilters();
    });
  });

  // Reset all filters
  if (filterAllBtn) {
    filterAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Reset filters
      activeFilters.price = null;
      activeFilters.duration = null;
      
      // Reset UI
      priceOptions.forEach(opt => opt.classList.remove('selected'));
      durationOptions.forEach(opt => opt.classList.remove('selected'));
      priceDropdownBtn.querySelector('.filter-label').textContent = 'Стоимость';
      durationDropdownBtn.querySelector('.filter-label').textContent = 'Длительность';
      priceDropdownBtn.classList.remove('active');
      durationDropdownBtn.classList.remove('active');
      priceDropdownMenu.classList.add('hidden');
      durationDropdownMenu.classList.add('hidden');
      
      // Apply filters (show all)
      applyFilters();
      
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
