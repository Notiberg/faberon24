// Seller Service API functions
const SELLER_API_BASE = 'http://localhost:8081/api/v1';

// Get all companies
async function getCompanies() {
  try {
    const response = await fetch(`${SELLER_API_BASE}/companies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch companies: ${response.status}`);
    }

    const data = await response.json();
    // API returns { companies: [...] } format
    const companies = data.companies || data || [];
    logger.info('Companies loaded from backend', { count: companies.length });
    return companies;
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'getCompanies');
    logger.error('Failed to get companies:', errorInfo);
    return [];
  }
}

// Get company by ID
async function getCompany(companyId) {
  try {
    const response = await fetch(`${SELLER_API_BASE}/companies/${companyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch company: ${response.status}`);
    }

    const data = await response.json();
    logger.info('Company loaded from backend', { companyId });
    return data;
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'getCompany');
    logger.error('Failed to get company:', errorInfo);
    return null;
  }
}

// Get services for a company
async function getServices(companyId) {
  try {
    const response = await fetch(`${SELLER_API_BASE}/companies/${companyId}/services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.status}`);
    }

    const data = await response.json();
    // API returns { services: [...] } format
    const services = data.services || data || [];
    logger.info('Services loaded from backend', { companyId, count: services.length });
    return services;
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'getServices');
    logger.error('Failed to get services:', errorInfo);
    return [];
  }
}

// Get service by ID
async function getService(companyId, serviceId) {
  try {
    const response = await fetch(`${SELLER_API_BASE}/companies/${companyId}/services/${serviceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch service: ${response.status}`);
    }

    const data = await response.json();
    logger.info('Service loaded from backend', { companyId, serviceId });
    return data;
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'getService');
    logger.error('Failed to get service:', errorInfo);
    return null;
  }
}

// Create company (requires authentication)
async function createCompany(companyData) {
  try {
    const response = await fetch(`${SELLER_API_BASE}/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': String(currentUserID),
        'X-User-Role': currentUserRole
      },
      body: JSON.stringify(companyData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create company: ${response.status}`);
    }

    const data = await response.json();
    logger.info('Company created successfully', { companyId: data.id });
    return data;
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'createCompany');
    logger.error('Failed to create company:', errorInfo);
    throw error;
  }
}

// Update company (requires authentication)
async function updateCompany(companyId, companyData) {
  try {
    const response = await fetch(`${SELLER_API_BASE}/companies/${companyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': String(currentUserID),
        'X-User-Role': currentUserRole
      },
      body: JSON.stringify(companyData)
    });

    if (!response.ok) {
      throw new Error(`Failed to update company: ${response.status}`);
    }

    const data = await response.json();
    logger.info('Company updated successfully', { companyId });
    return data;
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'updateCompany');
    logger.error('Failed to update company:', errorInfo);
    throw error;
  }
}

// Delete company (requires authentication)
async function deleteCompany(companyId) {
  try {
    const response = await fetch(`${SELLER_API_BASE}/companies/${companyId}`, {
      method: 'DELETE',
      headers: {
        'X-User-ID': String(currentUserID),
        'X-User-Role': currentUserRole
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete company: ${response.status}`);
    }

    logger.info('Company deleted successfully', { companyId });
    return true;
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'deleteCompany');
    logger.error('Failed to delete company:', errorInfo);
    throw error;
  }
}

// Create service (requires authentication)
async function createService(companyId, serviceData) {
  try {
    const response = await fetch(`${SELLER_API_BASE}/companies/${companyId}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': String(currentUserID),
        'X-User-Role': currentUserRole
      },
      body: JSON.stringify(serviceData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create service: ${response.status}`);
    }

    const data = await response.json();
    logger.info('Service created successfully', { companyId, serviceId: data.id });
    return data;
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'createService');
    logger.error('Failed to create service:', errorInfo);
    throw error;
  }
}

// Update service (requires authentication)
async function updateService(companyId, serviceId, serviceData) {
  try {
    const response = await fetch(`${SELLER_API_BASE}/companies/${companyId}/services/${serviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': String(currentUserID),
        'X-User-Role': currentUserRole
      },
      body: JSON.stringify(serviceData)
    });

    if (!response.ok) {
      throw new Error(`Failed to update service: ${response.status}`);
    }

    const data = await response.json();
    logger.info('Service updated successfully', { companyId, serviceId });
    return data;
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'updateService');
    logger.error('Failed to update service:', errorInfo);
    throw error;
  }
}

// Delete service (requires authentication)
async function deleteService(companyId, serviceId) {
  try {
    const response = await fetch(`${SELLER_API_BASE}/companies/${companyId}/services/${serviceId}`, {
      method: 'DELETE',
      headers: {
        'X-User-ID': String(currentUserID),
        'X-User-Role': currentUserRole
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete service: ${response.status}`);
    }

    logger.info('Service deleted successfully', { companyId, serviceId });
    return true;
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'deleteService');
    logger.error('Failed to delete service:', errorInfo);
    throw error;
  }
}

// Load and render services on index page
async function loadAndRenderServices() {
  try {
    // Get all companies
    const companies = await getCompanies();
    
    if (!companies || companies.length === 0) {
      logger.warn('No companies found');
      return;
    }

    // For now, use the first company
    const company = companies[0];
    logger.info('Using first company', { companyId: company.id, name: company.name });

    // Get services for this company
    const services = await getServices(company.id);
    
    if (!services || services.length === 0) {
      logger.warn('No services found for company');
      return;
    }

    // Render services
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) {
      logger.error('Services grid not found in DOM');
      return;
    }

    // Clear existing service cards (except the first one if it's a template)
    const existingCards = servicesGrid.querySelectorAll('.service-card');
    existingCards.forEach(card => card.remove());

    // Create service cards from backend data
    services.forEach(service => {
      const card = document.createElement('div');
      card.className = 'frame-9_464 service-card';
      card.setAttribute('data-service-id', service.id);
      card.setAttribute('data-service-name', service.name);
      card.setAttribute('data-service-duration', `${service.average_duration} мин`);
      card.setAttribute('data-service-short', service.description || '');
      card.setAttribute('data-service-full', service.description || '');
      
      card.innerHTML = `
        <span class="text-2_1366">Время:</span>
        <span class="service-price-display">${service.average_duration} мин</span>
        <div class="frame-2_1371">
          <div class="vector-21_9"></div>
        </div>
        <span class="text-2_1365 service-name">${service.name}</span>
        <span class="text-2_1369 service-description">${service.description || ''}</span>
      `;
      
      servicesGrid.appendChild(card);
    });

    logger.info('Services rendered successfully', { count: services.length });
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'loadAndRenderServices');
    logger.error('Failed to load and render services:', errorInfo);
    errorHandler.showNotification('Не удалось загрузить услуги', 'error');
  }
}

// Initialize seller services on page load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadAndRenderServices();
  } catch (error) {
    logger.error('Failed to initialize seller services:', error);
  }
});
