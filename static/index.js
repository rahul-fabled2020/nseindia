const url = "/api/load-json";

async function fetchNSEIndiaData() {
  const today = new Date();
  const date = today.toISOString().substring(0, 10);
  const response = await fetch(url + `/${date}.json`);

  return await response.json();
}

async function processNSEIndiaData() {
  const filter = document.getElementById("symbol")?.value;
  const allRecords = await fetchNSEIndiaData();
  const records = !filter
    ? allRecords
    : allRecords.filter((item) => item.underlying === filter);

  const getTemplate = (data, previouosData) => {
    const cePeDifference = data.ceCOITotal - data.peCOITotal;
    const ceDifferenceWithPrevious =
      data.ceCOITotal - (previouosData.ceCOITotal || 0);
    const peDifferenceWithPrevious =
      data.peCOITotal - (previouosData.peCOITotal || 0);
    const ratioOfDifferences =
      peDifferenceWithPrevious !== 0
        ? ceDifferenceWithPrevious / peDifferenceWithPrevious
        : "-";
    const ratioOfCeandPe =
      data.peCOITotal !== 0 ? data.ceCOITotal / data.peCOITotal : "-";
    const ratioOfPeandCe =
      data.ceCOITotal !== 0 ? data.peCOITotal / data.ceCOITotal : "-";

    const differenceClass =
      data.ceCOITotal < data.peCOITotal ? "text-danger" : "text-primary";
    const differenceWithPrevClass =
      ceDifferenceWithPrevious < peDifferenceWithPrevious
        ? "text-danger"
        : "text-primary";

    return `<tr>
            <td scope="row">${formatDate(data.timestamp)}</td>
            <td>${data.ceCOITotal}</td>
            <td>${data.peCOITotal}</td>
            <td>${cePeDifference}</td>
            <td class="${differenceClass}">${ratioOfCeandPe}</td>
            <td class="${differenceClass}">${ratioOfPeandCe}</td>
            <td>${ceDifferenceWithPrevious}</td>
            <td>${peDifferenceWithPrevious}</td>
            <td class="${differenceWithPrevClass}">${ratioOfDifferences}</td>
            <td>${data.underlying}</td>
            <td>${data.underlyingValue}</td>
            <td>${data.expiryDate}</td>
        </tr>`;
  };
  const stockDiv = document.getElementById("stockData");

  stockDiv.innerHTML = "";

  for (let i = records.length - 1; i >= 0; i--) {
    const data = records[i];
    const previouosData = records[i - 1] || {};

    stockDiv.innerHTML += getTemplate(data, previouosData);
  }
}

function formatDate(date) {
  const today = new Date(date);

  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")} ${String(
    today.getHours()
  ).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}:${String(
    today.getSeconds()
  ).padStart(2, "0")}`;
}

processNSEIndiaData();
setInterval(processNSEIndiaData, 60 * 1000);

window.onload = (event) => {
  const symbols = {
    HDFC: "HDFCBANK",
    ICICI: "ICICIBANK",
    KOTAK_MAHINDRA: "KOTAKBANK",
    AXIS: "AXISBANK",
    SBI: "SBIN",
    BANKNIFTY: "BANKNIFTY",
  };
  const symbolEl = document.getElementById("symbol");

  symbolEl.addEventListener("change", handleOptionChange);

  Object.keys(symbols).forEach((symbol) => {
    const value = symbols[symbol];
    const optionEl = document.createElement("option");

    optionEl.value = value;
    optionEl.innerText = symbol;

    symbolEl.appendChild(optionEl);
  });
};

function handleOptionChange(event) {
  processNSEIndiaData();
}
