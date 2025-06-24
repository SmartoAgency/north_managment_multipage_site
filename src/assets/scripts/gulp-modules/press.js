import jQuery from '../modules/pagination/pagination'; // Ensure correct path if installed via npm

const PRESS_PAGE_PARAM = 'press_page';

function getQueryParam(name) {
    if (!name) return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function addQueryParam(key, value) {
    var currentUrl = window.location.href;
    var regex = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = currentUrl.indexOf('?') !== -1 ? '&' : '?';

    if (currentUrl.match(regex)) {
        var newUrl = currentUrl.replace(regex, '$1' + key + '=' + value + '$2');
    } else {
        var newUrl = currentUrl + separator + encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
    window.history.replaceState({ path: newUrl }, '', newUrl);
}

const fd = new FormData();
fd.append('action', 'news');
const url = window.location.href.match(/localhost/) ? './static/mock-news.json' : '/wp-admin/admin-ajax.php';
fetch(url, {
    method: 'POST',
    body: fd,
})
    .then(response => response.json())
    .then(data => {
        if (data && data.result) {
            const fetchedData = data.result;
            initPagination(fetchedData);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

function initPagination(fetchedData) {
    jQuery('.pagination').pagination({
        dataSource: fetchedData,
        className: 'pagination',
        prevClassName: 'pagination__arrow',
        nextClassName: 'pagination__arrow',
        prevText: `
            <svg xmlns="http://www.w3.org/2000/svg" width="11.321" height="11.321" viewBox="0 0 11.321 11.321">
                <path id="Icon_ionic-md-arrow-forward" data-name="Icon ionic-md-arrow-forward" d="M5.977,12.345h8.6l-3.962,3.962,1.026.991,5.66-5.66-5.66-5.66-.99.991,3.927,3.962h-8.6Z" transform="translate(17.297 17.297) rotate(180)" fill="#f4f3ec"></path>
            </svg>
            <span>Prev</span>
        `,
        nextText: ` 
            <span>Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="11.321" height="11.321" viewBox="0 0 11.321 11.321">
                <path id="Icon_ionic-md-arrow-forward" data-name="Icon ionic-md-arrow-forward" d="M0,4.953H8.6L4.634.991,5.66,0l5.66,5.66-5.66,5.66-.99-.991L8.6,6.368H0Z" fill="#f4f3ec"></path>
            </svg>
        `,
        ulClassName: 'pagination__digits',
        pageNumber: getQueryParam(PRESS_PAGE_PARAM) || 1,
        callback: function (data, pagination) {
            const bigContainer = jQuery('.press-block__group1');
            const smallContainer = jQuery('.press-block__group2');

            const dataForBigContainer = data.filter((item, index) => index <= 2);
            const dataForSmallContainer = data.filter((item, index) => index > 2);

            bigContainer.empty();
            smallContainer.empty();
            
            const bigCardsHtml = dataForBigContainer.map(item => bigCardTemplate(item)).join('');
            bigContainer.html(bigCardsHtml);
            
            const smallCardsHtml = dataForSmallContainer.map(item => smallCardTemplate(item)).join('');
            smallContainer.html(smallCardsHtml);

            addQueryParam(PRESS_PAGE_PARAM, pagination.pageNumber);
            

            document.querySelector('.press-block__content').scrollIntoView({
                behavior: 'smooth',
            });
        }
    });
}


function smallCardTemplate(data = {}) {
    const { date, image, logo_main, logo_page, text, title, url } = data;

    return `
        <div class="press-card2">
            <div class="press-card2__img"><img src="${logo_page || 'https://north-development-wp.smarto.com.ua/wp-content/themes/3d/assets/images/press-img.svg'}" alt="" srcset=""></div>
            <div class="press-card2__text-wrap">
                <div class="press-card2__date">${date || 'April 1 2024'}</div>
                <div class="press-card2__text">${text || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam…'}</div>
            </div><a class="press-card2__link" href="${url || 'http://google.com'}" target="_blank" rel="noopener noreferrer"><span>ReAD FULL ARTICLE</span><svg xmlns="http://www.w3.org/2000/svg" width="16.563" height="16.563" viewBox="0 0 16.563 16.563">
                    <path id="Icon_ionic-md-arrow-back" data-name="Icon ionic-md-arrow-back" d="M11.712,5.124H2.818l4.1-4.1L5.856,0,0,5.856l5.856,5.856,1.025-1.025-4.062-4.1h8.894Z" transform="translate(16.563 8.282) rotate(135)" fill="#f4f3ec"></path>
                </svg></a>
        </div>
    `
}

function bigCardTemplate(data = {}) {
    const { date, image, logo_main, logo_page, text, title, url } = data;
    return `
        <div class="press-card">
            <div class="press-card__date">${date || 'April 4 2024'}</div>
            <div class="press-card__img">
                <img src="${logo_page || './assets/images/press-img.svg'}" alt="" srcset="">
            </div>
            <div class="press-card__img2">
                <img src="${image || './assets/images/press-img2.jpg'}" alt="" srcset="">
            </div>
            <div class="press-card__title">${title || 'Article Title'}</div>
            <div class="press-card__text">${text || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam'}</div>
            <a class="press-card__link" href="${url || '#'}" target="_blank"> <span>ReAD FULL ARTICLE</span><svg xmlns="http://www.w3.org/2000/svg" width="16.563" height="16.563" viewBox="0 0 16.563 16.563">
                    <path fill="#F4F3EC" id="Icon_ionic-md-arrow-back" data-name="Icon ionic-md-arrow-back" d="M17.688,11.1H8.795l4.1-4.1L11.833,5.977,5.977,11.833l5.856,5.856,1.025-1.025-4.062-4.1h8.894Z" transform="translate(25.015 8.282) rotate(135)"></path>
                </svg>
            </a>
        </div>
    `
}