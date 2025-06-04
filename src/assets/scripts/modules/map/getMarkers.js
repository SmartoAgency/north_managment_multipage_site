import markersFromPrevSite from "./markersFromPrevSite";

const baseFolder = window.location.href.match(/localhost/) 
? './assets/images/markers/'
: '/wp-content/themes/rams/assets/images/markers/';

const markersAdresses = {
    main: `${baseFolder}main.svg`,
    'domus_flats_brickell_center': `${baseFolder}domus_flats_brickell_center.svg`,
  };

const markerPopupStyle = `
style="
background: #ffffff;
color:#000000;
font-weight: bold;
padding:5px 10px;
font-size: 16px;
line-height: 120%;"
`;

export async function fetchMarkersData(google) {

    
    const buildLogoSize = new google.maps.Size(35,35);
    const sendData = new FormData();
    sendData.append('action', 'infrastructure');
    const url = window.location.href.match(/localhost/)
      ? 'https://central-park-wp.smarto.com.ua/wp-admin/admin-ajax.php'
      : '/wp-admin/admin-ajax.php'
    // let markersData = window.location.href.match(/localhost|smarto/) ? Promise.resolve(mockData()) : await fetch(url, {
    //   method: 'POST',
    //   body: sendData,
    // });
    let markersData = Promise.resolve(mockData());
    // markersData = window.location.href.match(/localhost|smarto/) ? mockData() : await markersData.json();
    markersData = mockData();
    if (!markersData) {
      console.warn('Wrong data recieved');
      return;
    };

    let formatedMarkersDataForMap = markersData.reduce((acc, el) => {
      if (!el.list) return acc;
      el.list.forEach(marker => {
        acc.push({
          content: `<div ${markerPopupStyle}>${marker.name}</div>`,
          position: { 
            lat: marker.coordinations.latitude, 
            lng: marker.coordinations.elevation 
          },
          type: el.code,
          id: marker.id,
          zIndex: 2,
          icon: { url: markersAdresses[el.code], scaledSize: buildLogoSize }
        });
      });
      return acc;
    }, []);


    console.log(formatedMarkersDataForMap);

    markersFromPrevSite().forEach(marker => {
        formatedMarkersDataForMap.push({
            content: marker.description,
            position: { 
              lat: marker.lat, 
              lng: marker.lng 
            },
            type: marker.category,
            id: marker.id,
            zIndex: 1,
            icon: { url: markersAdresses[marker.category], scaledSize: buildLogoSize }
          })
    })

    return formatedMarkersDataForMap;
}



function mockData() {
    return [
        {
            "name": "North Development headquarter",
            "code": "main",
            "list": [
                {
                    "name": "North Development headquarter",
                    "id": "north-development-hq",
                    "coordinations": {
                      latitude: 25.76211078627346, 
                      elevation: -80.19233182884052
                    }
                },
                {
                    "name": "Domus Flats Brickell Park",
                    "id": "domus-flats-brickell-park",
                    "coordinations": {
                      latitude: 25.75978972765427,
                      elevation:  -80.19770537328476
                    }
                },
                {
                    "name": "Domus Flats Brickell Center",
                    "id": "domus-flats-brickell-center",
                    "coordinations": {
                      latitude: 25.763745825667705,
                      elevation:  -80.19755326818876, 
                    }
                },
                {
                    "name": "House of Wellness",
                    "id": "house-of-wellness",
                    "coordinations": {
                      latitude: 25.765180393698483,
                      elevation: -80.19676367272604,
                    }
                }
            ]
        },
    ]
}


