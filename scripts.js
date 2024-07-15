document.addEventListener('DOMContentLoaded', () => {
    const pinForm = document.getElementById('pinForm');
    const album = document.querySelector('.album');
    const searchButton = document.getElementById('searchButton');
    const searchQuery = document.getElementById('searchQuery');

    
    // Fetch and load pins from CSV on page load
    localStorage.clear();
    fetchCsvAndLoadPins('/data/pins.csv');

    pinForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const pinTitle = document.getElementById('pinTitle').value;
        const pinImage = document.getElementById('pinImage').value;
        const pinDescription = document.getElementById('pinDescription').value;

        const pin = {
            title: pinTitle,
            image: pinImage,
            description: pinDescription
        };

        addPinToAlbum(pin);
        savePin(pin);
        pinForm.reset();
    });

    searchButton.addEventListener('click', () => {
        const query = searchQuery.value.toLowerCase();
        const pins = getPins();
        const filteredPins = pins.filter(pin => pin.title.toLowerCase().includes(query));
        displayPins(filteredPins);
    });

    function fetchCsvAndLoadPins(csvUrl) {
        fetch(csvUrl)
            .then(response => response.text())
            .then(text => {
                const pins = csvToPins(text);
                displayPins(pins);
                pins.forEach(savePin);
            })
            .catch(error => console.error('Error fetching CSV:', error));
    }

    function csvToPins(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        const pins = lines.slice(1).map(line => {
            const data = line.split(',');
            const pin = {};
            headers.forEach((header, index) => {
                pin[header.trim()] = data[index].trim();
            });
            return pin;
        });
        return pins;
    }

    function addPinToAlbum(pin) {
        const pinElement = document.createElement('div');
        pinElement.className = 'pin';

        const img = document.createElement('img');
        img.src = pin.image;
        img.alt = pin.title;

        const title = document.createElement('h3');
        title.textContent = pin.title;

        const description = document.createElement('p');
        description.textContent = pin.description;

        pinElement.appendChild(img);
        pinElement.appendChild(title);
        pinElement.appendChild(description);

        album.appendChild(pinElement);
    }

    function savePin(pin) {
        const pins = getPins();
        pins.push(pin);
        localStorage.setItem('pins', JSON.stringify(pins));
    }

    function getPins() {
        const pins = localStorage.getItem('pins');
        return pins ? JSON.parse(pins) : [];
    }

    function displayPins(pins) {
        album.innerHTML = '';
        pins.forEach(pin => addPinToAlbum(pin));
    }
});
