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
      overflow: visible; 
    }
    .slider-container h2 {
      font-size: 32px;
      line-height: 43px;
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
      flex: 0 0 calc((100% / 6.5) - (16px * 8.5 / 6.5)); 
      text-align: center;
      padding: 16px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }
    .product-card img {
      width: 100%;
      height: auto;
    }
    .product-card .name {
      margin: 8px 0;
      font-size: 14px;
      cursor: pointer; 
    }
    .product-card .price {
      color: #193db0;
      font-size: 18px; 
      display: inline-block; 
      line-height: 22px; 
      font-weight: bold; 
      margin: 8px 0; 
    }
    .slider-button {
      position: absolute;
      top: 50%; 
      transform: translateY(-50%);
      background: none;
      color: #2F4F4F;
      border: none;
      padding: 8px 16px;
      font-size: 35px; 
      cursor: pointer;
      border-radius: 70%; 
      width: 50px; 
      height: 50px; 
      z-index: 1; 
    }
    .slider-button.left {
      left: -30px; 
    }
    .slider-button.right {
      right: -30px; 
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

    leftButton.on("click", () => {
      sliderWrapper.stop().animate({ scrollLeft: `-=${scrollAmount}` }, 300);
    });

    rightButton.on("click", () => {
      sliderWrapper.stop().animate({ scrollLeft: `+=${scrollAmount}` }, 300);
    });
  };

  init();
})();
