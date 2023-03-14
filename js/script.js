
window.addEventListener('DOMContentLoaded', () =>{
// Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

          function hideTabContent () {
            tabsContent.forEach(item => {
                item.style.display = 'none';
            });

            tabs.forEach(item => {
                item.classList.remove('tabheader__item_active');
            });
          }

          function showTabContent(i = 0){
            tabsContent[i].style.display = 'block';
            tabs[i].classList.add('tabheader__item_active');
          }

          hideTabContent();
          showTabContent();

          tabsParent.addEventListener('click', (event) => {
            const target = event.target;

            if (target && target.classList.contains('tabheader__item')){
                tabs.forEach((item, i) => {
                    if (target == item){
                        hideTabContent();
                        showTabContent(i);
                    }
                });
            }
          });

        // Timer
        
        const deadLine = '2023-02-20';

        function getTimeRemaining(endtime) {
          const t = Date.parse(endtime) - Date.parse(new Date()),
                days = Math.floor(t / (1000 * 60 * 60 * 24)),
                hours = Math.floor((t / (1000 * 60 * 60) % 24)),
                minutes = Math.floor((t / 1000 / 60) % 60),
                seconds = Math.floor((t / 1000) % 60);

                return {
                  'total': t,
                  'days': days,
                  'hours': hours,
                  'minutes': minutes,
                  'seconds': seconds
                };
        }

        function getZero(num) {
          if (num >= 0 && num < 10) {
            return `0${num}`;
          } else {
            return num;
          }
        }

        function setClock(selector, endtime) {
          const timer = document.querySelector(selector),
                days = timer.querySelector('#days'),
                hours = timer.querySelector('#hours'),
                minutes = timer.querySelector('#minutes'),
                seconds = timer.querySelector('#seconds'),
                timeInterval = setInterval(updateClock, 1000);

                updateClock();

                function updateClock(){
                  const t = getTimeRemaining(endtime);

                  days.innerHTML = getZero(t.days);
                  hours.innerHTML = getZero(t.hours);
                  minutes.innerHTML = getZero(t.minutes);
                  seconds.innerHTML = getZero(t.seconds);

                  if (t.total <= 0) {
                    clearInterval(timeInterval);
                  }
             }
        }

        setClock('.timer', deadLine);

        // modal

        const modalTrigger = document.querySelectorAll('[data-modal]'),
              modal = document.querySelector('.modal'),
              modalCloseBtn = document.querySelector('[data-close]');

        function openModal(){
          modal.style.display = 'block';
          document.body.style.overflow = 'hidden';
          clearInterval(modalTimerId);
        }      

        modalTrigger.forEach(btn => {
          btn.addEventListener('click', openModal);
        });  
        
        function closeModal(){
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }

        modalCloseBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            closeModal();
          }
        });

        document.addEventListener('keydown', (e) => {
          if (e.code === "Escape" && modal.style.display == 'block') {
            closeModal();
          }
        });

        const modalTimerId = setTimeout(openModal, 5000);

        function showModalByScroll() {
          if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
          }
        }

        window.addEventListener('scroll', showModalByScroll);

        // Используем классы для карточек 

        class MenuCard {
          constructor(src, alt, title, desrc, price, parentSelector, ...classes){
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.desrc = desrc;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAN();
          }

          changeToUAN() {
            this.price = this.price * this.transfer;
          }

          render() {
            const element = document.createElement('div');

            if(this.classes.length === 0){
              this.element = 'menu__item';
              element.classList.add(this.element);
            } else {
              this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
              <img src=${this.src} alt=${this.alt}>
              <h3 class="menu__item-subtitle">${this.title}</h3>
              <div class="menu__item-descr">${this.desrc}</div>
                <div class="menu__item-divider"></div>
                  <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                  <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
              </div>
            `;
            this.parent.append(element);
          }
        }

        const getResource = async (url) => {
          const res = await fetch(url);

          if (!res.ok) {
            throw new Erorr(`Could not fetch ${url}, status: ${res.status}`);
          }

          return await res.json();
        };
        
        getResource('http://localhost:3000/menu')
        .then(data => {
          data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
          });
        });

        // Forms
        
        const forms = document.querySelectorAll('form');

        const message = {
          loading: 'Загрузка',
          success: 'Спасибо! Скоро мы с вами свяжемся',
          failure: 'Что-то пошло не так...'
        };

        forms.forEach(item => {
          bindpostData(item);
        });

        const postData = async (url, data) => {
          const res = await fetch(url, {
            method: 'POST',
              headers: {
                'Content-type': 'application/json'
              },
              body: data
          });

          return await res.json();
        };

        function bindpostData(form) {
          form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMassage = document.createElement('div');
            statusMassage.classList.add('status');
            statusMassage.textContent = message.loading;
            form.append(statusMassage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                statusMassage.textContent = message.success;
                form.reset();
                statusMassage.remove();
            }).catch(() => {
                statusMassage.textContent = message.failure;
            }).finally(() => {
                form.reset();
            });
          });
        }

        fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));

        // Slider 

        const slides = document.querySelectorAll('.offer__slide'),
              prev = document.querySelector('.offer__slider-prev'),
              next = document.querySelector('.offer__slider-next'),
              total = document.querySelector('#total'),
              current = document.querySelector('#current');
        let slideIndex = 1;     

        showSlides(slideIndex);

        if (slides.length < 10) {
          total.textContent = `0${slides.length}`;
        } else {
          total.textContent = slides.length;
        }

        function showSlides(n) {
          if (n > slides.length) {
            slideIndex = 1;
          }

          if (n < 1) {
            slideIndex = slides.length;
          }

          slides.forEach(item => item.style.display = 'none');

          slides[slideIndex - 1].style.display = '';

          if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
          } else {
            current.textContent = {slideIndex};
          }
        }

        function plusSlides(n) {
          showSlides(slideIndex += n);
        }

        prev.addEventListener('click', () => {
          plusSlides(-1);
        });

        next.addEventListener('click', () => {
          plusSlides(1);
        });
});