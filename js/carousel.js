$(document).ready(function () {
    const dataUrl = 'data.json';
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = parseInt(urlParams.get('id'), 10);

    if (!propertyId) {
        console.error("No property ID provided in the URL.");
        return;
    }

    // Fetch JSON data
    $.getJSON(dataUrl, function (data) {
        const records = data.records || [];
        const property = records.find(r => r.id === propertyId);

        if (!property || !property.fields['Image_Gallery']) {
            console.error("No images found for this property.");
            return;
        }

        // Parse Image_Gallery field
        let urls = property.fields['Image_Gallery']
            .split('\n')
            .map(url => url.trim()); // Split and trim the URLs

        // Ensure there are a multiple of 4 images
        const remainder = urls.length % 4;
        if (remainder !== 0) {
            const extraImagesNeeded = 4 - remainder;
            for (let i = 0; i < extraImagesNeeded; i++) {
                urls.push(urls[i % urls.length]); // Repeat images as needed
            }
        }

        // Populate main carousel
        const mainCarousel = $('#carousel .carousel-inner');
        mainCarousel.empty();
        urls.forEach((url, index) => {
            const activeClass = index === 0 ? 'active' : '';
            mainCarousel.append(
                `<div class="main-image item ${activeClass}">
                    <img src="${url}" alt="main-image">
                </div>`
            );
        });

        // Populate thumbnail carousel
        const thumbCarousel = $('#thumbcarousel .carousel-inner');
        thumbCarousel.empty();
        let thumbGroup = '';
        urls.forEach((url, index) => {
            thumbGroup += 
                `<div data-target="#carousel" data-slide-to="${index}" class="thumb">
                    <img src="${url}" alt="Thumbnail">
                </div>`;
            if ((index + 1) % 4 === 0 || index === urls.length - 1) {
                const activeClass = thumbCarousel.children().length === 0 ? 'active' : '';
                thumbCarousel.append(
                    `<div class="item ${activeClass}">${thumbGroup}</div>`
                );
                thumbGroup = ''; // Reset for the next group
            }
        });

        // Initialize Bootstrap carousels
        $('#carousel').carousel();
        $('#thumbcarousel').carousel();
    }).fail(function (jqxhr, textStatus, error) {
        console.error("Failed to fetch data:", textStatus, error);
    });
});
