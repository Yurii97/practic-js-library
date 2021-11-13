const canvas = document.querySelector('.js-chart').getContext('2d');
const GLOBAL_MEAN_TEMP = 14;

fechData()
    .then(parseData)
    .then(mapData)
    .then(({ years, globTemp, NHemTemp, SHemTemp }) => drawChart(years, globTemp, NHemTemp, SHemTemp))

function fechData() {
    return fetch('./temp.csv')
        .then(response => response.text())
};

function parseData(data) {
    return Papa.parse(data, { header: true }).data;
};

function mapData(data) {
    return data.reduce(
        (acc, entry) => {
            acc.years.push(entry.Year);
            acc.globTemp.push(Number(entry.Glob) + GLOBAL_MEAN_TEMP);
            acc.NHemTemp.push(Number(entry.NHem) + GLOBAL_MEAN_TEMP);
            acc.SHemTemp.push(Number(entry.SHem) + GLOBAL_MEAN_TEMP);
            return acc;
        }, { years: [], globTemp: [], NHemTemp: [], SHemTemp: [] }
    );
};

function drawChart(years, globTemp, NHemTemp, SHemTemp) {
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Global Temp',
                data: globTemp,
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
                tension: 0.1,
            },
            {
                label: 'NHem Temp',
                data: NHemTemp,
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
                tension: 0.1,
            },
            {
                label: 'SHem Temp',
                data: SHemTemp,
                borderColor: 'rgb(255, 205, 86)',
                borderWidth: 1,
                tension: 0.1,
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function (value) {
                            return value + "°";
                        }
                    }
                }
            }
        }
    });
};

