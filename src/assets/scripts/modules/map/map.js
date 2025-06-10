import { fetchMarkersData } from "./getMarkers";
import mapStyle from "./map-style";



export default function googleMap() {
  global.initMap = initMap
}

async function func() {
  const script = document.createElement('script');
  let key = document.documentElement.dataset.key ? document.documentElement.dataset.key : '';
  // if (window.location.href.match(/localhost|smarto/)) key = '';
  // const key = '';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap&language=${document.documentElement.getAttribute('lang')}`;
  document.getElementsByTagName('head')[0].appendChild(script);
}
// setTimeout(func, 1000);
const maps = document.querySelectorAll('.map');
const options = {
  rootMargin: '0px',
  threshold: 0.1,
};

maps.forEach((image) => {
  const callback = (entries, observer) => {
    /* Content excerpted, show below */
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src;
        observer.unobserve(image);
        func();
      }
    });
  };
  const observer = new IntersectionObserver(callback, options);
  const target = image;
  observer.observe(target);
});

// eslint-disable-next-line no-unused-vars
function initMap() {
  const gmarkers1 = [];
  //28.4600074, 49.2384203
  const center = {
    lat: 25.76212616844805,
    lng: -80.19225672694336,
  };
  /** Массив, куда записываются выбраные категории */
  const choosedCategories = new Set();
  choosedCategories.add('main');
  /** Елементы, при клике на который будет происходить фильтрация */
  const filterItems = document.querySelectorAll('[data-marker]');
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: true,
    gestureHandling: 'cooperative',
    language: document.documentElement.getAttribute('lang') || 'en',
    styles: mapStyle()
  });
  window.googleMap = map;

  //Добавляем на карту
  // polygon.setMap(map);

  const filterMarkers = function (category, categoriesArray) {
    gmarkers1.forEach((el) => {
      if (categoriesArray.has(el.category)) {
        el.setMap(map);
        el.setAnimation(google.maps.Animation.DROP);
      } else {
        el.setMap(null);
      }
    });
  };
  filterItems.forEach((item) => {
    item.addEventListener('click', (evt) => {
      evt.stopImmediatePropagation();
      item.classList.toggle('active');
      if (item.classList.contains('active')) {
        choosedCategories.add(item.dataset.category);
        if (item.dataset.multicategory) {
          const innerCategories = item.dataset.multicategory.split('~');
          innerCategories.forEach(el => choosedCategories.add(el));
        }
      } else {
        choosedCategories.delete(item.dataset.category);
        if (item.dataset.multicategory) {
          const innerCategories = item.dataset.multicategory.split('~');
          innerCategories.forEach(el => choosedCategories.delete(el));
        }
      }
      filterMarkers('main', choosedCategories);
    });
  });


  // var baseFolder = '/wp-content/themes/centower/assets/images/markers/';
  const baseFolder = window.location.href.match(/localhost/) 
    ? './assets/images/markers/'
    : '/wp-content/themes/central-park/assets/images/markers/';
  let defaultMarkerSize = new google.maps.Size(40, 53);
  if (document.documentElement.clientWidth < 950) {
    // defaultMarkerSize = new google.maps.Size(40, 53);
  }
  const buildLogoSize = new google.maps.Size(125, 55);
  const markersAdresses = {
    main: `${baseFolder}main.svg`,
    'domus_flats_brickell_center': `${baseFolder}domus_flats_brickell_center.svg`,
  };
  const markerPopupStyle = `
          style="
          font-weight: bold;
          padding:5px 10px;
          font-size: 16px;
          line-height: 120%;"
          `;


  
  const ajaxMarkers = fetchMarkersData(google);

  ajaxMarkers.then(result => {
    putMarkersOnMap(result, map);
  })
  console.log(ajaxMarkers);

  function putMarkersOnMap(markers, map) {
    const infowindow = new google.maps.InfoWindow({
      content: '',
      maxWidth: 200,
    });
    const initedMarkers = [];
    markers.forEach((marker) => {
      const category = marker.type;
      console.log('marker', marker);
      
      const mapMarker = new google.maps.Marker({
        map,
        category,
        zIndex: marker.zIndex || 1,
        icon: marker.icon,
        dataId: marker.id,
        content: marker.content,
        position: new google.maps.LatLng(marker.position.lat, marker.position.lng),
      });
      // mapMarker.dataId = +marker.id;
      initedMarkers.push(mapMarker);
  
      google.maps.event.addListener(mapMarker, 'click', function () {
        infowindow.setContent(marker.content);
        infowindow.open(map, mapMarker);
        map.panTo(this.getPosition());
      });
      mapMarker.name = marker.type;
      gmarkers1.push(mapMarker);
    });
    map.initedMarkers = initedMarkers;
    console.log(map);
    // filterMarkers('main', choosedCategories);
    markersHightlight(google, map, infowindow);
    // markersHandler();
  }
  /* beautify preserve:end */
  
  
}



function markersHightlight(google, map, infowindow) {
  document.querySelectorAll('[data-map-marker]').forEach(el => {
    
    el.addEventListener('change',function(evt){
      const markerId = evt.target.id;
      const marker = map.initedMarkers.find(r => r.dataId == markerId);
      console.log('map.initedMarkers', map.initedMarkers);
      map.setZoom(markerId == 'main' ? 15 : 16);
      infowindow.close();
      if (!marker) return;
      console.log('marker.getPosition()', marker.getPosition());
      
      map.setCenter(marker.getPosition());
      //infoWindow
      infowindow.setContent(marker.content);
      infowindow.open(map, marker);
    });
  })
}