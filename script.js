const NAV_LINKS = [
  { href: "#home", label: "Главная" },
  { href: "#services", label: "Услуги" },
  { href: "#managers", label: "Менеджеры" },
  { href: "#vacancies", label: "Вакансии" },
  { href: "#why", label: "Почему мы" },
  { href: "#contacts", label: "Контакты" },
];

const COMPANY_CONTACT = {
  phone: {
    href: "tel:+79217817976",
    text: "+7 (921) 781-79-76",
  },
  email: {
    href: "mailto:avtoslancy@mail.ru",
    text: "avtoslancy@mail.ru",
  },
  address: "\u0433. \u0421\u043b\u0430\u043d\u0446\u044b, \u041f\u0435\u0440\u0435\u0443\u043b\u043e\u043a \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0438\u0441\u0442\u043e\u0432, \u0437\u0434. 1, \u0434. 33",
  schedule: "Пн-Пт: 9:00-18:00, Сб-Вс: по запросу",
  messengers: [
    {
      href: "https://wa.me/79217817976",
      icon: "ri-whatsapp-line",
      label: "WhatsApp",
    },
  ],
};

function renderNavigation() {
  document.querySelectorAll("[data-nav-target]").forEach((list) => {
    const isMobile = list.dataset.navTarget === "mobile";
    const itemsMarkup = NAV_LINKS.map(({ href, label }) => {
      const attributes = [`href="${href}"`];
      if (isMobile) {
        attributes.push("data-mobile-nav-link");
      }
      return `<li><a ${attributes.join(" ")}>${label}</a></li>`;
    }).join("");

    list.innerHTML = itemsMarkup;
  });
}

function renderContacts() {
  const { phone, email, address, schedule, messengers } = COMPANY_CONTACT;

  document
    .querySelectorAll("[data-contact-link='phone']")
    .forEach((element) => {
      element.setAttribute("href", phone.href);
    });

  document
    .querySelectorAll("[data-contact-text='phone']")
    .forEach((element) => {
      element.textContent = phone.text;
    });

  document
    .querySelectorAll("[data-contact-link='email']")
    .forEach((element) => {
      element.setAttribute("href", email.href);
    });

  document
    .querySelectorAll("[data-contact-text='email']")
    .forEach((element) => {
      element.textContent = email.text;
    });

  document
    .querySelectorAll("[data-contact-text='address']")
    .forEach((element) => {
      element.textContent = address;
    });

  document
    .querySelectorAll("[data-contact-text='schedule']")
    .forEach((element) => {
      element.textContent = schedule;
    });

  document
    .querySelectorAll("[data-contact-messengers]")
    .forEach((container) => {
      const linkClass = container.dataset.contactMessengers || "";
      const classAttribute = linkClass ? ` class="${linkClass}"` : "";

      container.innerHTML = messengers
        .map(
          ({ href, icon, label }) =>
            `<a href="${href}"${classAttribute} aria-label="${label}" target="_blank" rel="noopener noreferrer"><i class="${icon}"></i></a>`
        )
        .join("");
    });
}

// Оптимизированная функция инициализации
function initApp() {
  renderNavigation();
  renderContacts();
  // Кэширование DOM элементов
  const elements = {
    mobileNav: document.getElementById("mobileNav"),
    burgerMenuToggle: document.querySelector(".burger-menu"),
    mobileNavCloseBtn: document.querySelector(".mobile-nav-close-btn"),
    contactPopup: document.getElementById("contact-popup"),
    closePopupBtn: document.getElementById("close-popup-btn"),
    openPopupBtn: document.getElementById("open-popup-btn"),
    managersGrid: document.querySelector(".managers-grid"),
    paginationDots: document.getElementById("manager-pagination-dots"),
    mobileNavLinks: document.querySelectorAll("[data-mobile-nav-link]"),
    popupTriggers: document.querySelectorAll("[data-mobile-popup-trigger]"),
    fadeElements: document.querySelectorAll(".scroll-fade-in"),
  };

  // Выход если ключевые элементы отсутствуют
  if (!elements.mobileNav || !elements.contactPopup) return;

  // Универсальные функции управления состоянием
  const toggleElementState = (element, show, overflowHidden = true) => {
    if (!element) return;

    // Вычисляем ширину скроллбара
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (show) {
      element.classList.add("active");
      if (overflowHidden) {
        // Компенсируем ширину скроллбара
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      element.classList.remove("active");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  };

  const showPopup = () => toggleElementState(elements.contactPopup, true);
  const hidePopup = () => toggleElementState(elements.contactPopup, false);
  const showMobileNav = () => toggleElementState(elements.mobileNav, true);
  const hideMobileNav = () => toggleElementState(elements.mobileNav, false);

  // Обработчики событий
  const setupEventListeners = () => {
    // Мобильное меню
    if (elements.burgerMenuToggle) {
      elements.burgerMenuToggle.addEventListener("click", showMobileNav);
    }

    if (elements.mobileNavCloseBtn) {
      elements.mobileNavCloseBtn.addEventListener("click", hideMobileNav);
    }

    // Закрытие меню по клику на ссылки
    elements.mobileNavLinks.forEach((link) => {
      link.addEventListener("click", hideMobileNav);
    });

    // Попап
    if (elements.openPopupBtn) {
      elements.openPopupBtn.addEventListener("click", showPopup);
    }

    if (elements.closePopupBtn) {
      elements.closePopupBtn.addEventListener("click", hidePopup);
    }

    elements.contactPopup.addEventListener("click", (e) => {
      if (e.target === elements.contactPopup) hidePopup();
    });

    // Триггеры попапа
    elements.popupTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        showPopup();
      });
    });
  };

  // Слайдер менеджеров (только мобильные)
  const initManagerSlider = () => {
    if (
      !elements.managersGrid ||
      !elements.paginationDots ||
      window.innerWidth > 1023
    )
      return;

    const managerCards =
      elements.managersGrid.querySelectorAll(".manager-card");
    const dots = elements.paginationDots.querySelectorAll(".dot");

    if (managerCards.length === 0 || dots.length === 0) return;

    const updateActiveDot = () => {
      const scrollLeft = elements.managersGrid.scrollLeft;
      const cardWidth = managerCards[0].offsetWidth;
      const currentCardIndex = Math.round(scrollLeft / cardWidth);

      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentCardIndex);
      });
    };

    // Оптимизация: throttling для scroll события
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateActiveDot, 50);
    };

    elements.managersGrid.addEventListener("scroll", handleScroll);

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        const cardWidth = managerCards[0].offsetWidth;
        elements.managersGrid.scrollTo({
          left: cardWidth * index,
          behavior: "smooth",
        });
      });
    });

    updateActiveDot();
  };

  // Анимации появления при скролле
  const initScrollAnimations = () => {
    if (elements.fadeElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.fadeElements.forEach((element) => observer.observe(element));
  };

  // Обработчик изменения размера окна
  const setupResizeHandler = () => {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initManagerSlider, 250);
    });
  };

  // Инициализация всех модулей
  setupEventListeners();
  initManagerSlider();
  initScrollAnimations();
  setupResizeHandler();
}

// Запуск приложения после загрузки DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
