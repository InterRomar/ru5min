Element.prototype.appendAfter = function(element) {                         // Создаем свой метод для для вставки элемента после друго эл-та
    element.parentNode.insertBefore(this, element.nextSibling);
}
function noop() {}                                          // Просто пустая функция, для отсутствия действий в тернарном операторе

function _createModalFooter(buttons = []) {                 // Функция создания modal-footer (если он нужен, создаем, и наоборт). Аргумент = массив кнопок,которые будут в футере
    if (buttons.length === 0) return document.createElement('div');                  // Если кнопок нет, создаем пустой div

    const wrap = document.createElement('div');                          // Если кнопки есть, создаем div и присваиваем ему класс modal-footer
    wrap.classList.add('modal-footer');

    buttons.forEach(btn => {                                             // Для каждой кнопки из массива, создаем уже реальную кнопку в футере
        const $btn = document.createElement('button');
        $btn.textContent = btn.text;                                     //  
        $btn.classList.add('btn');
        $btn.classList.add('button');
        $btn.classList.add('button--modal');
        $btn.classList.add(`btn-${btn.type || 'secondary'}`);
        $btn.onclick = btn.handler || noop;                                  // Вешаем обработчик на клик, для каждой кнопки, сколько бы их не было
                                                                             // .. функции прописаны в Handler у кнопок
        wrap.appendChild ($btn);                                             // Вставляем полученную кнопку в футер, и так происходит с каждой
    });
    return wrap;                                                            // Возвращаем футер
}



function _createModal(options) {                                            // Функция создания модального окна
    const modal = document.createElement('div');                            // Создаем div и присваиваем ему класс vmodal (Привет Владилену :D ) 
    const close = document.createElement('span');                           // Создаем span и присваиваем ему класс modal-close (из названия ясно зачем)
    const DEFAULT_WIDTH = '600px';                          // Дефолтная ширина модалки, в случае если она не будет передана в объекте
    modal.classList.add('vmodal');
    close.classList.add('modal-close');

    //---------------Здесь создаем само модальное окно, с нужными динамическими вставками-----------------
    //_____ closable  - булево значение, отвечает за возможность закрытия окна
    //_____ content   - Динамический контент, передаем дальше нужный нам
    if(window.matchMedia("(min-width: 500px)").matches) {
        modal.insertAdjacentHTML('afterbegin', `                          
        <div class="modal-overlay" data-close='true'>
            <div class="modal-window" style='width: ${options.width || DEFAULT_WIDTH}; height: ${options.height || "50%"}'>
                <div class="modal-header">
                    <span class="modal-title"> ${options.title || 'Window'} </span>
                    ${options.closable ? '<span class="modal-close" data-close="true">&times;</span>' : ''}
                </div>
                <div class="modal-body" data-content>
                    <div class='modal-wrap'>Запуск курсов <strong>14 марта</strong>.</div>
                    ${options.content || ''}
                </div>

            </div>
        </div>
    `);
    } else {
        modal.insertAdjacentHTML('afterbegin', `                          
        <div class="modal-overlay" data-close='true'>
            <div class="modal-window">
                <div class="modal-header">
                    <span class="modal-title"> ${options.title || 'Window'} </span>
                    ${options.closable ? '<span class="modal-close" data-close="true">&times;</span>' : ''}
                </div>
                <div class="modal-body" data-content>
                    <div class='modal-wrap'>Запуск курсов <strong>14 марта</strong>.</div>
                    ${options.content || ''}
                </div>

            </div>
        </div>
    `);
    }
    const footer = _createModalFooter(options.footerButtons);                           // Пользуемся ранее созданной функцией создания футера 
    footer.appendAfter(modal.querySelector('[data-content]'));                         // Вставляем modal-footer после modal-body, используя кастомный метод (1-3 стр), в
                                                                                       //.. кач-ве аргумента просто инициальзируем modal-body
    document.body.appendChild(modal);                               // И наконец вставляем созданное модальное окно в наш документ
    return modal;


}



$.modal = function (options) {
    const ANIMATION_SPEED = 200;
    const $modal = _createModal(options);                 // Получаем функцию создания модалки
    const close = document.querySelector('.modal-close');
    let closing = false;
    let destroyed = false;
    const tempBtn = document.querySelector('.temp');

    // -----------------temp-----------------
    // tempBtn.addEventListener('click', () => {
    //     modal.open();
    // })

    const modal = {
        open() {
            if (destroyed) {
                return console.log('Modal is destroyed!');
            }
            !closing && $modal.classList.add('open');                   // Проверка на случай, если модалка еще не закрыта

            document.body.classList.add('lock');
        },
        close() {
            closing = true;                             // Отмечаем, что закрыли модалку
            $modal.classList.remove('open');            // Всё просто, убираем Open, and add Hide, чтобы скрыть модалку
            $modal.classList.add('hide');
            document.body.classList.remove('lock');
            setTimeout(() => {                          //.. единственный нюанс, это создание небольшого таймаута для сохранения анимации при закрытии
                $modal.classList.remove('hide');        //Добавляется промежуточный класс Hide, на котором работает анимация пропадания модалки, 
                closing = false;                        // .. и он удаляется через 200ms - равное время анимации
                if(typeof options.onClose === 'function') {
                    options.onClose();
                }
                
            }, ANIMATION_SPEED);
        },

    };

    const listener = event => {                         // Создается обработчик событий на закрытие, проверяется есть ли у таргета атрибут data-close
        if(event.target.dataset.close) {                //.. по классике он есть у спана-крестика и оверлэя (затемненной области вокруг модалки)
            modal.close();                              // .. ну и производится закрытие
        }
    }

    $modal.addEventListener('click', listener);         // И сразу этот обработчик вешается на весь главный блок модалки  
                                                        // .. объявляется отдельно заранее специально, для более простого его удаления в дальнейшем
    
    return Object.assign(modal, {                       // В итоге возвращаем весь объект, по ходу записав в него еще пару нужных методов через метод Object.assign()
        destroy() {
            $modal.parentNode.removeChild($modal);   // Удаление DOM елемента
            $modal.removeEventListener('click',listener);   // То самое удаление обработчика
            destroyed = true;
        },
        setContent(html) {
            $modal.querySelector('[data-content]').innerHTML = html;  // Динамическое изменение контента модалки
        }
    });
};