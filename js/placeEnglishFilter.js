  var codeBlock = `
<!-- End Property header -->
  <section id="aa-advance-search">
    <div class="container">
      <div class="aa-advance-search-area">
        <div class="form">
          <div class="aa-advance-search-top">
            <div class="row">
              <div class="col-md-5">
                <div id="neighborhood-dropdown-container">
                <select id="neighborhood-select">
                  <!-- dynamically populated -->
                </select>
              </div>  </div>
              <div class="col-md-4">
              <div id="property-status-dropdown-container">

                  <select id="property-status">
                  </select></div>
            </div>

              <div class="col-md-3">
        <!-- English Version -->
        <div class="aa-single-advance-search english">
          <select>
            <option value="0" selected>Rooms</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>

        <!-- Hebrew Version -->
        <div class="aa-single-advance-search hebrew">
          <select>
            <option value="0" selected>חדרים</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>
              </div>
            </div>
          </div>
          <div class="aa-advance-search-bottom">
            <div class="row">
              <div class="col-md-12">
                <div class="aa-single-filter-search english">
                  <span>PRICE </span>
                  <span>FROM</span>
                  <span id="skip-value-lower" class="example-val">0</span>
                  <span>TO</span>
                  <span id="skip-value-upper" class="example-val">100.00</span>
                  <div id=".aa-price-range" class="noUi-target noUi-ltr noUi-horizontal noUi-background">
                  </div>                  
                </div>
              </div>
            </div>  
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- / Advance Search -->
    `;

// Inserting the code block to wrapper element
document.getElementById("english-price-filter").innerHTML = codeBlock