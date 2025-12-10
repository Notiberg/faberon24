/**
 * Filters Module
 * Handles filter modal and filtering logic
 */

let activeFilters = {
  companies: [],
  priceMin: 0,
  priceMax: 10000,
  duration: []
};

// Initialize filters
function initFilters() {
  const filterBtn = document.querySelector('.frame-21_190');
  const filtersModal = document.getElementById('filters-modal');
  const filtersClose = document.getElementById('filters-close');
  const filtersApply = document.getElementById('filters-apply');
  const filtersReset = document.getElementById('filters-reset');
  const priceMinInput = document.getElementById('price-min');
  const priceMaxInput = document.getElementById('price-max');
  const priceMinDisplay = document.getElementById('price-min-display');
  const priceMaxDisplay = document.getElementById('price-max-display');

  // Open filters modal
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      filtersModal.classList.remove('hidden');
      loadCompanyFilters();
    });
  }

  // Close filters modal
  if (filtersClose) {
    filtersClose.addEventListener('click', () => {
      filtersModal.classList.add('hidden');
    });
  }

  // Close on overlay click
  const overlay = document.querySelector('.filters-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      filtersModal.classList.add('hidden');
    });
  }

  // Update price display
  if (priceMinInput && priceMaxInput) {
    priceMinInput.addEventListener('input', (e) => {
      activeFilters.priceMin = parseInt(e.target.value);
      priceMinDisplay.textContent = activeFilters.priceMin;
    });

    priceMaxInput.addEventListener('input', (e) => {
      activeFilters.priceMax = parseInt(e.target.value);
      priceMaxDisplay.textContent = activeFilters.priceMax;
    });
  }

  // Apply filters
  if (filtersApply) {
    filtersApply.addEventListener('click', () => {
      // Get selected companies
      const companyCheckboxes = document.querySelectorAll('#company-filters input[type="checkbox"]:checked');
      activeFilters.companies = Array.from(companyCheckboxes).map(cb => parseInt(cb.value));

      // Get selected durations
      const durationCheckboxes = document.querySelectorAll('input[name="duration"]:checked');
      activeFilters.duration = Array.from(durationCheckboxes).map(cb => cb.value);

      // Apply filters to services
      applyFilters();

      // Close modal
      filtersModal.classList.add('hidden');
    });
  }

  // Reset filters
  if (filtersReset) {
    filtersReset.addEventListener('click', () => {
      // Reset form
      document.querySelectorAll('#company-filters input[type="checkbox"]').forEach(cb => cb.checked = false);
      document.querySelectorAll('input[name="duration"]').forEach(cb => cb.checked = false);
      priceMinInput.value = 0;
      priceMaxInput.value = 10000;
      priceMinDisplay.textContent = '0';
      priceMaxDisplay.textContent = '10000';

      // Reset active filters
      activeFilters = {
        companies: [],
        priceMin: 0,
        priceMax: 10000,
        duration: []
      };

      // Show all services
      applyFilters();
    });
  }
}

// Load company filters dynamically
async function loadCompanyFilters() {
  try {
    const companyFiltersContainer = document.getElementById('company-filters');
    if (!companyFiltersContainer) return;

    // Get all companies
    const companies = await getCompanies();
    if (!companies || companies.length === 0) return;

    // Clear existing filters
    companyFiltersContainer.innerHTML = '';

    // Add company checkboxes
    companies.forEach(company => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = company.id;
      checkbox.checked = activeFilters.companies.includes(company.id);

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(company.name));
      companyFiltersContainer.appendChild(label);
    });
  } catch (error) {
    console.error('Error loading company filters:', error);
  }
}

// Apply filters to services
function applyFilters() {
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    let shouldShow = true;

    // Get card data
    const companyId = parseInt(card.dataset.companyId);
    const price = parseInt(card.dataset.price) || 0;
    const duration = parseInt(card.dataset.duration) || 0;

    // Check company filter
    if (activeFilters.companies.length > 0 && !activeFilters.companies.includes(companyId)) {
      shouldShow = false;
    }

    // Check price filter
    if (price < activeFilters.priceMin || price > activeFilters.priceMax) {
      shouldShow = false;
    }

    // Check duration filter
    if (activeFilters.duration.length > 0) {
      let durationMatch = false;
      activeFilters.duration.forEach(dur => {
        if (dur === 'quick' && duration <= 30) durationMatch = true;
        if (dur === 'medium' && duration > 30 && duration <= 60) durationMatch = true;
        if (dur === 'long' && duration > 60) durationMatch = true;
      });
      if (!durationMatch) shouldShow = false;
    }

    // Show or hide card
    card.style.display = shouldShow ? 'block' : 'none';
  });

  // Log filter state
  console.log('Filters applied:', activeFilters);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
});
