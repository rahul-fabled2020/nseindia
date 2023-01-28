const url = "/api/load-json";

async function fetchNSEIndiaData() {
  const today = new Date();
  const date = today.toISOString().substring(0, 10);
  const response = await fetch(url + `/${date}.json`);

  return await response.json();
}

async function processNSEIndiaData() {
  const records = await fetchNSEIndiaData();

  const getTemplate = (data, previouosData) => {
          const cePeDifference = data.ceCOITotal - data.peCOITotal;
          const ceDifferenceWithPrevious = data.ceCOITotal - (previouosData.ceCOITotal || 0);
          const peDifferenceWithPrevious = data.peCOITotal - (previouosData.peCOITotal || 0);
          const ratioOfDifferences = peDifferenceWithPrevious !== 0 ? ceDifferenceWithPrevious / peDifferenceWithPrevious: "-";
          const ratioOfCeandPe = data.peCOITotal !== 0 ? data.ceCOITotal / data.peCOITotal: "-";

          const differenceClass = data.ceCOITotal < data.peCOITotal ? 'text-danger': 'text-primary';
          const differenceWithPrevClass = ceDifferenceWithPrevious < peDifferenceWithPrevious ? 'text-danger': 'text-primary';

          return `<tr>
            <td scope="row">${formatDate(data.timestamp)}</td>
            <td>${data.ceCOITotal}</td>
            <td>${data.peCOITotal}</td>
            <td>${cePeDifference}</td>
            <td class="${differenceClass}">${ratioOfCeandPe}</td>
            <td>${ceDifferenceWithPrevious}</td>
            <td>${peDifferenceWithPrevious}</td>
            <td class="${differenceWithPrevClass}">${ratioOfDifferences}</td>
            <td>${data.underlying}</td>
            <td>${data.underlyingValue}</td>
            <td>${data.expiryDate}</td>
        </tr>`}
  const stockDiv = document.getElementById('stockData');

  stockDiv.innerHTML = "";

  for(let i = records.length - 1; i >= 0; i--) {
      const data = records[i];
      const previouosData = records[i - 1] || {};

      stockDiv.innerHTML += getTemplate(data, previouosData)
  }
}

function formatDate(date) {
  const today = new Date(date);

  return`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}:${String(today.getSeconds()).padStart(2, '0')}`
}

processNSEIndiaData();
setInterval(processNSEIndiaData, 60 * 1000);
