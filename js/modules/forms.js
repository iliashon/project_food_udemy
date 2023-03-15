import { closeModal, openModal } from "./modal";
import { postData } from "../services/services";

function forms(formSelector) {
  // Forms

  const forms = document.querySelectorAll(formSelector);

  const message = {
    loading: "Загрузка",
    success: "Спасибо! Скоро мы с вами свяжемся",
    failure: "Что-то пошло не так...",
  };

  forms.forEach((item) => {
    bindpostData(item);
  });

  function bindpostData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const statusMassage = document.createElement("div");
      statusMassage.classList.add("status");
      statusMassage.textContent = message.loading;
      form.append(statusMassage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData("http://localhost:3000/requests", json)
        .then((data) => {
          console.log(data);
          statusMassage.textContent = message.success;
          form.reset();
          statusMassage.remove();
        })
        .catch(() => {
          statusMassage.textContent = message.failure;
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  fetch("http://localhost:3000/menu")
    .then((data) => data.json())
    .then((res) => console.log(res));
}

export default forms;
