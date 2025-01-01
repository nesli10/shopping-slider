(() => {
  const init = () => {
    fetchProducts();
  };

  const fetchProducts = () => {
    fetch(
      "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json"
    )
      .then((response) => response.json())
      .then((data) => {
        buildHTML(data);
        buildCSS();
        addSliderFunctionality();
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  const buildHTML = (products) => {
    // Slider container
    const sliderContainer = $("<div>").addClass("slider-container");

    // Title
    const title = $("<h2>").text("Benzer Ürünler");
    sliderContainer.append(title);

    // Slider wrapper
    const sliderWrapper = $("<div>").addClass("slider-wrapper");

    // Product items
    products.forEach((product) => {
      const productCard = $("<div>").addClass("product-card");

      const img = $("<img>").attr("src", product.img).attr("alt", product.name);
      const name = $("<p>").text(product.name);
      const price = $("<p>").text(`${product.price} TRY`);

      productCard.append(img, name, price);
      sliderWrapper.append(productCard);
    });

    sliderContainer.append(sliderWrapper);

    // Left and right buttons
    const leftButton = $("<button>").addClass("slider-button left").text("<");
    const rightButton = $("<button>").addClass("slider-button right").text(">");

    sliderContainer.append(leftButton, rightButton);

    // Append to .product-detail element
    const productDetail = $(".product-detail");
    if (productDetail.length) {
      productDetail.append(sliderContainer);
    } else {
      console.error(".product-detail element not found");
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
        }
        .slider-container h2 {
          font-size: 24px;
          margin-bottom: 16px;
          text-align: left;
          font-family: 'Open Sans', sans-serif;
        }
        .slider-wrapper {
          display: flex;
          overflow: hidden;
          gap: 16px;
        }
        .product-card {
          flex: 0 0 auto;
          width: 150px;
          background: #f9f9f9;
          text-align: center;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .product-card img {
          width: 100%;
          height: auto;
          border-radius: 4px;
        }
        .product-card p {
          margin: 8px 0;
          font-size: 14px;
        }
        .slider-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: #000;
          color: #fff;
          border: none;
          padding: 8px 16px;
          font-size: 16px;
          cursor: pointer;
          border-radius: 4px;
        }
        .slider-button.left {
          left: 0;
        }
        .slider-button.right {
          right: 0;
        }
      `;

    $("<style>").addClass("carousel-style").html(css).appendTo("head");
  };

  const addSliderFunctionality = () => {
    const sliderWrapper = $(".slider-wrapper");
    const leftButton = $(".slider-button.left");
    const rightButton = $(".slider-button.right");

    let scrollAmount = 0;

    leftButton.on("click", () => {
      scrollAmount -= 200;
      if (scrollAmount < 0) scrollAmount = 0;
      sliderWrapper.stop().animate({ scrollLeft: scrollAmount }, 300);
    });

    rightButton.on("click", () => {
      scrollAmount += 200;
      if (
        scrollAmount >
        sliderWrapper[0].scrollWidth - sliderWrapper[0].clientWidth
      ) {
        scrollAmount =
          sliderWrapper[0].scrollWidth - sliderWrapper[0].clientWidth;
      }
      sliderWrapper.stop().animate({ scrollLeft: scrollAmount }, 300);
    });
  };

  init();
})();
