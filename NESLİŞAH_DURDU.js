(() => {
  const init = () => {
    const products = getProductsFromLocalStorage();
    if (products && products.length > 0) {
      buildHTML(products);
      buildCSS();
      addSliderFunctionality();
      checkLikedProducts(products);
    } else {
      fetchProducts();
    }
  };

  const fetchProducts = () => {
    fetch(
      "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json"
    )
      .then((response) => response.json())
      .then((data) => {
        saveProductsToLocalStorage(data);
        buildHTML(data);
        buildCSS();
        addSliderFunctionality();
        checkLikedProducts(data);
      })
      .catch((err) => console.error("Fetch hatası:", err));
  };

  const saveProductsToLocalStorage = (products) => {
    localStorage.setItem("products", JSON.stringify(products));
  };

  const getProductsFromLocalStorage = () => {
    const products = localStorage.getItem("products");
    return products ? JSON.parse(products) : null;
  };

  const buildHTML = (products) => {
    // Slider container
    const sliderContainer = $("<div>").addClass("slider-container");

    // Başlık
    const title = $("<h2>").text("Benzer Ürünler");
    sliderContainer.append(title);

    // Slider wrapper
    const sliderWrapper = $("<div>").addClass("slider-wrapper");

    // Ürün kartları
    products.forEach((product) => {
      const productCard = $("<div>").addClass("product-card");

      // Beğen butonu
      const likeButton = $("<div>")
        .addClass("like-button")
        .html(
          `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
        )
        .on("click", function () {
          $(this).toggleClass("liked");
          saveLikedProduct(product.id, $(this).hasClass("liked"));
        });

      const img = $("<img>")
        .attr("src", product.img)
        .attr("alt", product.name)
        .css("cursor", "pointer")
        .on("click", () => {
          window.open(product.url, "_blank");
        });

      const name = $("<p>")
        .addClass("name")
        .text(product.name)
        .css("cursor", "pointer")
        .on("click", () => {
          window.open(product.url, "_blank");
        });

      const price = $("<p>").addClass("price").text(`${product.price} TRY`);
      productCard.append(likeButton, img, name, price);
      sliderWrapper.append(productCard);
    });

    sliderContainer.append(sliderWrapper);

    // Sol ve sağ düğmeler
    const leftButton = $("<button>")
      .addClass("slider-button left")
      .html(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`
      );

    const rightButton = $("<button>")
      .addClass("slider-button right")
      .html(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`
      );

    sliderContainer.append(leftButton, rightButton);

    // .product-detail elementine ekle
    const productDetail = $(".product-detail");
    if (productDetail.length) {
      productDetail.append(sliderContainer);
    } else {
      console.error(".product-detail elementi bulunamadı");
    }
  };

  const buildCSS = () => {
    const css = `
      .slider-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
        padding: 16px;
        overflow: visible;
      }
      .slider-container h2 {
        font-size: 32px;
        line-height: 43px;
        margin-bottom: 16px;
        text-align: left;
        font-family: 'Open Sans', sans-serif;
        color: #29323b;
        font-weight: lighter;
        padding-left: 30px;
      }
      .slider-wrapper {
        display: flex;
        overflow-x: auto;
        gap: 16px;
        padding-left: 16px;
        scroll-behavior: smooth;
        -ms-overflow-style: none;  /* IE ve Edge */
        scrollbar-width: none;  /* Firefox */
      }
      .slider-wrapper::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
      }
      .product-card {
        flex: 0 0 calc((100% / 6.5) - (16px * 7.5 / 6.5));
        text-align: center;
        padding: 16px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        position: relative;
      }
      .like-button {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 28px;
        cursor: pointer;
        color: #2F4F4F;
        z-index: 2;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 6px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .like-button svg {
        width: 20px;
        height: 20px;
        stroke: #2F4F4F;
        fill: none;
      }
      .like-button.liked svg {
        fill: #193db0;
        stroke: #2F4F4F;
      }
      .product-card img {
        width: 100%;
        height: auto;
      }
      .product-card .name {
        margin: 8px 0 4px 0;
        font-size: 14px;
        cursor: pointer;
        color: #29323b !important;
        font-family: 'Open Sans', sans-serif !important;
        text-align: left;
        width: 100%;
      }
      .product-card .price {
        color: #193db0;
        font-size: 15px;
        display: inline-block;
        line-height: 22px;
        font-weight: bold;
        margin: 0px;
        font-family: 'Open Sans', sans-serif !important;
        text-align: left;
        width: 100%;
      }
      .slider-button {
        position: absolute;
        top: 55%;
        transform: translateY(-50%);
        background: none;
        color: #2F4F4F;
        border: none;
        padding: 8px 16px;
        font-size: 35px;
        cursor: pointer;
        border-radius: 70%;
        width: 70px;
        height: 50px;
        z-index: 1;
      }
      .slider-button.left {
        left: -40px;
      }
      .slider-button.right {
        right: -40px;
      }

      /* Mobil (max-width: 767px) */
      @media (max-width: 767px) {
        .slider-wrapper {
          scroll-snap-type: x mandatory;
        }
        .product-card {
          flex: 0 0 calc(100% - 16px);
          scroll-snap-align: start;
        }
        .slider-button {
          display: none;
        }
      }

      /* Tablet (768px - 1023px) */
      @media (min-width: 768px) and (max-width: 1023px) {
        .slider-wrapper {
          scroll-snap-type: x mandatory;
        }
        .product-card {
          flex: 0 0 calc(50% - 16px);
          scroll-snap-align: start;
        }
        .slider-button {
          display: none;
        }
      }

      /* Laptop (1024px - 1365px) */
      @media (min-width: 1024px) and (max-width: 1365px) {
        .product-card {
          flex: 0 0 calc((100% / 4) - (16px * 5 / 4));
        }
        .slider-button.left {
          left: -20px;
        }
        .slider-button.right {
          right: -20px;
        }
      }

      /* Desktop (1366px ve üzeri) */
      @media (min-width: 1366px) {
        .product-card {
          flex: 0 0 calc((100% / 6.5) - (16px * 7.5 / 6.5));
        }
        .slider-button.left {
          left: -40px;
        }
        .slider-button.right {
          right: -40px;
        }
      }
    `;

    $("<style>").addClass("carousel-style").html(css).appendTo("head");
  };

  const addSliderFunctionality = () => {
    const sliderWrapper = $(".slider-wrapper");
    const leftButton = $(".slider-button.left");
    const rightButton = $(".slider-button.right");

    const productCardWidth = $(".product-card").outerWidth(true);
    const gap = 16;

    const scrollAmount = productCardWidth + gap;

    leftButton.off("click");
    rightButton.off("click");
    sliderWrapper.off("mousedown mousemove mouseup mouseleave");

    leftButton.on("click", () => {
      sliderWrapper.stop().animate({ scrollLeft: `-=${scrollAmount}` }, 300);
    });

    rightButton.on("click", () => {
      sliderWrapper.stop().animate({ scrollLeft: `+=${scrollAmount}` }, 300);
    });

    if (window.innerWidth <= 1023) {
      let touchStartX = 0;
      let isScrolling = false;

      sliderWrapper.on("touchstart", (e) => {
        touchStartX = e.originalEvent.touches[0].clientX;
        isScrolling = true;
      });

      sliderWrapper.on("touchmove", (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const touchX = e.originalEvent.touches[0].clientX;
        const deltaX = touchX - touchStartX;
        sliderWrapper[0].scrollLeft -= deltaX;
        touchStartX = touchX;
      });

      sliderWrapper.on("touchend", () => {
        if (!isScrolling) return;
        isScrolling = false;

        const scrollLeft = sliderWrapper[0].scrollLeft;
        const nearestIndex = Math.round(scrollLeft / scrollAmount);
        sliderWrapper
          .stop()
          .animate({ scrollLeft: nearestIndex * scrollAmount }, 300);
      });

      let mouseStartX = 0;
      let isDragging = false;
      const dragThreshold = 50;

      sliderWrapper.on("mousedown", (e) => {
        isDragging = true;
        mouseStartX = e.clientX;
        sliderWrapper.css("cursor", "grabbing");
      });

      sliderWrapper.on("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const mouseX = e.clientX;
        const deltaX = mouseX - mouseStartX;

        if (Math.abs(deltaX) > dragThreshold) {
          isDragging = false;
          sliderWrapper.css("cursor", "grab");

          if (deltaX > 0) {
            sliderWrapper
              .stop()
              .animate({ scrollLeft: `-=${scrollAmount}` }, 300);
          } else {
            sliderWrapper
              .stop()
              .animate({ scrollLeft: `+=${scrollAmount}` }, 300);
          }
        }
      });

      sliderWrapper.on("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;
        sliderWrapper.css("cursor", "grab");
      });

      sliderWrapper.on("mouseleave", () => {
        if (isDragging) {
          isDragging = false;
          sliderWrapper.css("cursor", "grab");
        }
      });
    }
  };

  const saveLikedProduct = (productId, isLiked) => {
    const likedProducts =
      JSON.parse(localStorage.getItem("likedProducts")) || {};
    likedProducts[productId] = isLiked;
    localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
  };

  const checkLikedProducts = (products) => {
    const likedProducts =
      JSON.parse(localStorage.getItem("likedProducts")) || {};
    products.forEach((product) => {
      if (likedProducts[product.id]) {
        $(`.product-card:has(.like-button)`).each(function () {
          if ($(this).find(".name").text() === product.name) {
            $(this).find(".like-button").addClass("liked");
          }
        });
      }
    });
  };

  // İlk başlatma
  init();

  // Ekran boyutu değiştiğinde slider'ı yeniden başlat
  $(window).on("resize", () => {
    addSliderFunctionality();
  });
})();
