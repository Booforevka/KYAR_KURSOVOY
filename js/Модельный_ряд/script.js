// Класс для управления каталогом автомобилей
class CarsCatalog {
    constructor() {
        this.carsData = [];
        this.filteredCars = [];
        this.filters = {
            model: '',
            type: '',
            drivetrain: '',
            instock: '',
            maxPrice: 130000
        };
        this.itemsPerPage = 9;
        this.currentPage = 1;
        
        // DOM элементы
        this.carsContainer = document.getElementById('cars-container');
        this.paginationContainer = document.getElementById('pagination');
        this.cardTemplate = document.getElementById('car-card-template');
        
        // Фильтры
        this.modelFilter = document.getElementById('model-filter');
        this.typeFilter = document.getElementById('type-filter');
        this.drivetrainFilter = document.getElementById('drivetrain-filter');
        this.instockFilter = document.getElementById('instock-filter');
        this.priceFilter = document.getElementById('price-filter');
        
        // Кнопки фильтров
        this.applyButton = document.querySelector('.filters-actions .apply');
        this.resetButton = document.querySelector('.filters-actions .reset');
        this.toggleFiltersButton = document.getElementById('toggle-filters');
        
        // Удаляем или скрываем input для загрузки файла, так как он нам больше не нужен
        const xmlUpload = document.getElementById('xml-upload');
        if (xmlUpload) {
            xmlUpload.style.display = 'none'; 
        }
        
        this.init();
    }
    
    // Инициализация каталога
    async init() {
        try {
            
            const xmlPath = 'cars.xml'; 
            
            
            const response = await fetch(xmlPath);
            if (!response.ok) {
                throw new Error(`Не удалось загрузить файл: ${response.statusText}`);
            }
            
            const xmlData = await response.text();
            this.parseXML(xmlData);
            
            
            this.setupEventListeners();
            
            console.log('Catalog initialized with', this.carsData.length, 'cars');
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            this.carsContainer.innerHTML = `
                <div class="error-message">
                    <p>Произошла ошибка при загрузке данных. Проверьте файл cars.xml в корневой папке.</p>
                    <p>Детали ошибки: ${error.message}</p>
                </div>
            `;
        }
    }
    
    // Получение значения из XML узла
    getXmlValue(node, tagName) {
        const element = node.querySelector(tagName);
        return element ? element.textContent : '';
    }
    
    // Настройка обработчиков событий
    setupEventListeners() {
        // Фильтры
        this.applyButton.addEventListener('click', () => this.applyFilters());
        this.resetButton.addEventListener('click', () => this.resetFilters());
        
        // Обновление значения цены при изменении ползунка
        if (this.priceFilter) {
            this.priceFilter.addEventListener('input', (e) => {
                const rangeValues = document.querySelector('.range-values span:last-child');
                if (rangeValues) {
                    rangeValues.textContent = `до ${this.formatPrice(parseInt(e.target.value))}`;
                }
            });
        }
        
        // Переключение видимости фильтров
        if (this.toggleFiltersButton) {
            this.toggleFiltersButton.addEventListener('click', () => {
                const filtersGrid = document.querySelector('.filters-grid');
                const filtersActions = document.querySelector('.filters-actions');
                
                if (filtersGrid.style.display === 'none') {
                    filtersGrid.style.display = 'grid';
                    filtersActions.style.display = 'flex';
                    this.toggleFiltersButton.textContent = 'Скрыть фильтры';
                } else {
                    filtersGrid.style.display = 'none';
                    filtersActions.style.display = 'none';
                    this.toggleFiltersButton.textContent = 'Показать фильтры';
                }
            });
        }
        
        // Обработка клика на пагинацию
        if (this.paginationContainer) {
            this.paginationContainer.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    this.currentPage = parseInt(e.target.textContent);
                    this.renderCars();
                    
                    // Активная кнопка пагинации
                    const buttons = this.paginationContainer.querySelectorAll('button');
                    buttons.forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    // Прокрутка к началу каталога
                    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }
    
    // Парсинг XML
    parseXML(xmlData) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
            
            // Проверка на ошибки парсинга
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                throw new Error('XML parsing error: ' + parserError.textContent);
            }
            
            // Парсинг XML в массив объектов
            const carNodes = xmlDoc.querySelectorAll('car');
            this.carsData = Array.from(carNodes).map(carNode => {
                let price = this.getXmlValue(carNode, 'price');
                price = price.replace(/[^\d.]/g, ''); 
                
                return {
                    id: this.getXmlValue(carNode, 'id'),
                    model: this.getXmlValue(carNode, 'model'),
                    type: this.getXmlValue(carNode, 'type'),
                    price: parseInt(price) || 0, 
                    image: `images/Фото_автомобилей/${this.getXmlValue(carNode, 'image')}`,
                    engine: this.getXmlValue(carNode, 'engine'),
                    acceleration: parseFloat(this.getXmlValue(carNode, 'acceleration')),
                    consumption: this.getXmlValue(carNode, 'consumption'),
                    drivetrain: this.getXmlValue(carNode, 'drivetrain'),
                    instock: this.getXmlValue(carNode, 'instock') === 'true',
                    range: this.getXmlValue(carNode, 'range') || null
                };
            });
            
            this.filteredCars = [...this.carsData];
            this.renderCars();
            
        } catch (error) {
            console.error('Ошибка парсинга XML:', error);
            this.carsContainer.innerHTML = '<p>Ошибка обработки XML файла. Убедитесь, что файл имеет правильный формат.</p>';
        }
    }
    
    // Применение фильтров
    applyFilters() {
        // Получаем значения фильтров
        this.filters.model = this.modelFilter.value;
        this.filters.type = this.typeFilter.value;
        this.filters.drivetrain = this.drivetrainFilter.value;
        this.filters.instock = this.instockFilter.value;
        this.filters.maxPrice = parseInt(this.priceFilter.value);
        
        // Фильтруем автомобили
        this.filteredCars = this.carsData.filter(car => {
            return (
                (this.filters.model === '' || car.model === this.filters.model) &&
                (this.filters.type === '' || car.type === this.filters.type) &&
                (this.filters.drivetrain === '' || car.drivetrain === this.filters.drivetrain) &&
                (this.filters.instock === '' || car.instock === (this.filters.instock === 'true')) &&
                car.price <= this.filters.maxPrice
            );
        });
        
        // Сбрасываем пагинацию и рендерим
        this.currentPage = 1;
        this.renderCars();
    }
    
    // Сброс фильтров
    resetFilters() {
        this.modelFilter.value = '';
        this.typeFilter.value = '';
        this.drivetrainFilter.value = '';
        this.instockFilter.value = '';
        this.priceFilter.value = 130000;
        
       const rangeValues = document.querySelector('.range-values span:last-child');
       if (rangeValues) {
           rangeValues.textContent = `до 130 000€`;
       }
       
       this.filters = {
           model: '',
           type: '',
           drivetrain: '',
           instock: '',
           maxPrice: 130000
       };
       
       this.filteredCars = [...this.carsData];
       this.currentPage = 1;
       this.renderCars();
   }
    
    // Рендеринг автомобилей с учетом пагинации
    renderCars() {
        this.carsContainer.innerHTML = '';
        
        // Расчет индексов для текущей страницы
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const carsToShow = this.filteredCars.slice(startIndex, endIndex);
        
        // Если нет автомобилей после фильтрации
        if (carsToShow.length === 0) {
            this.carsContainer.innerHTML = '<div class="no-results">По вашему запросу ничего не найдено. Попробуйте изменить параметры фильтрации.</div>';
            this.paginationContainer.innerHTML = '';
            return;
        }
        
        // Создаем карточки для каждого автомобиля
        carsToShow.forEach(car => {
            const carCard = this.createCarCard(car);
            this.carsContainer.appendChild(carCard);
        });
        this.addCardEventListeners();
        
        // Обновляем пагинацию
        this.renderPagination();
    }
    addCardEventListeners() {
        const cards = this.carsContainer.querySelectorAll('.catalog-card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const carId = card.dataset.carId;
                // Здесь можно добавить переход на страницу детального просмотра автомобиля
                console.log(`Клик по карточке автомобиля с ID: ${carId}`);
                
                // Для примера показываем уведомление
                this.showNotification(`Вы выбрали автомобиль: ${card.querySelector('.catalog-card-title').textContent.trim()}`);
            });
        });
    }
    
    // Создание карточки автомобиля
    createCarCard(car) {
        const template = this.cardTemplate.content.cloneNode(true);
        const card = template.querySelector('.catalog-card');
        
        // Добавляем ID автомобиля как data-атрибут
        card.dataset.carId = car.id;
        
        // Заполняем данными из XML
        template.querySelector('.catalog-card-image').src = car.image;
        template.querySelector('.catalog-card-image').alt = `${car.model} ${car.type}`;
        template.querySelector('.catalog-card-title .model').textContent = `Audi ${car.model}`;
        template.querySelector('.catalog-card-title .type').textContent = car.type;
        template.querySelector('.catalog-card-price').textContent = `от ${this.formatPrice(car.price)}`;
        
        // Добавляем метку наличия
        const instockElement = template.querySelector('.catalog-card-instock');
        if (car.instock) {
            instockElement.textContent = 'В наличии';
            instockElement.classList.add('available');
        } else {
            instockElement.textContent = 'Под заказ';
            instockElement.classList.add('unavailable');
        }
        
        // Заполняем спецификации
        template.querySelector('.engine span:last-child').textContent = car.engine;
        template.querySelector('.acceleration span:last-child').textContent = `${car.acceleration} с`;
        template.querySelector('.consumption span:last-child').textContent = car.consumption;
        template.querySelector('.drivetrain span:last-child').textContent = car.drivetrain;
        
        // Если это электромобиль, добавляем запас хода
        if (car.range) {
            const rangeElem = document.createElement('div');
            rangeElem.className = 'range';
            rangeElem.innerHTML = '<span>Запас хода:</span><span>' + car.range + ' км</span>';
            template.querySelector('.catalog-card-specs').appendChild(rangeElem);
        }
        
        return template;
    }
    
    // Обновление пагинации
    renderPagination() {
        const totalPages = Math.ceil(this.filteredCars.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            this.paginationContainer.innerHTML = '';
            return;
        }
        
        this.paginationContainer.innerHTML = '';
        
        // Создаем кнопки страниц
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            
            if (i === this.currentPage) {
                button.classList.add('active');
            }
            
            this.paginationContainer.appendChild(button);
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }
}

// Инициализация каталога при загрузке документа
document.addEventListener('DOMContentLoaded', () => {
    const catalog = new CarsCatalog();
});