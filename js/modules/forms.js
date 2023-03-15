function forms () {
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
}

export default forms;