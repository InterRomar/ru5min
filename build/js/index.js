const priceModal = $.modal({                                // Создаем модалку с ценой для товара
    title: 'Скоро',
    closable: false,
    content: 'С нетерпением ждем вас!',
    width: '40%',
    height: '300px',
    footerButtons: [
        {text: 'Закрыть', type: 'primary', handler() {
            priceModal.close();
        }},
    ]
});


document.addEventListener('click',event => {                        // Вешается обработчик событий на весь документ, с последующим обозначением таргетов
    const btnType = event.target.dataset.btn;                       // Определение типа кнопки из атрибута data-btn, в данном случае есть 'price' & 'remove'
    const id = +event.target.dataset.id;                            // Объявление id кнопки, для последующего определения на какую кнопку кликнули
    
    const rateButtons = document.querySelectorAll('.rates__option');
    const courseLinks = document.querySelectorAll('.courses__link');


    
    rateButtons.forEach(item => {
        if(event.target === item) {
            event.preventDefault();                                         // Сброс дефолтного поведения элемента
            priceModal.open();
        }
    });
    courseLinks.forEach(item => {
        if(event.target === item) {
            console.log(item);
            event.preventDefault();                                         // Сброс дефолтного поведения элемента
            priceModal.open();
        }
    });
});



