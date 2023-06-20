function initialize() {

    const countryFlags = new Map();
    // retrieves a map with all the countries.
    const countryCapitalCoords = new Map();

    const countryDescriptions = new Map();

    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            data.forEach(country => {
                const name = country.name.common;
                const capitalCoords = country.capital ? country.latlng : [0, 0];
                countryCapitalCoords.set(name, capitalCoords);
            });

        })
        .catch(error => console.error(error));

    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            data.forEach(country => {
                const name = country.name.common;
                //const countryCode = country.cca2;
                //console.log("cca2:",countryCode);
                const wikipediaUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&redirects=1&titles=${name}`;

                // Fetch the abstract description from Wikipedia
                fetch(wikipediaUrl)
                    .then(response => response.json())
                    .then(data => {
                        const pages = data.query.pages;
                        const pageId = Object.keys(pages)[0];
                        const description = pages[pageId].extract;
                        countryDescriptions.set(name, description);
                    })
                    .catch(error => console.error(error));
            });
        })
        .catch(error => console.error(error));


    fetch('https://flagcdn.com/en/codes.json')
        .then(response => response.json())
        .then(data => {
            //get url of images
            for (const [code, name] of Object.entries(data)) {
                const flagUrl = `https://flagcdn.com/160x120/${code.toLowerCase()}.png`;
                countryFlags.set(name, flagUrl);
            }
            // Now you can use the countryFlags Map to display flags on a map
            // For example, if you're using Leaflet.js:
            const map = WE.map('map', { center: [-29.50, 145], zoom: 3.5 });

            WE.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
                maxZoom: 18
            }).addTo(map)
            //add flags to the map
            for (var [name, flagUrl] of countryFlags.entries()) {

                //TODO: for some reason the flag of USA wont apear cause they added states. 
                if (countryCapitalCoords.get(name) != null) {
                    var latlng = countryCapitalCoords.get(name);
                }
                var marker = WE.marker(latlng).addTo(map);

                marker.bindPopup(`<h3>${name}</h3><img src="${flagUrl}" alt="${name} flag" style="max-width:100px;max-height:60px;"><a>"something${name}"</a>`);
            }
        })
        .catch(error => console.error(error));

    console.log("DESC:", countryDescriptions);
    console.log("DESC2:", description);
    //console.log("Guat:",countryDescriptions.get("Guatemala"));
    console.log("COORDS:", countryCapitalCoords);
    //console.log("Guat Coords:",countryCapitalCoords.get('Guatemala'));
}