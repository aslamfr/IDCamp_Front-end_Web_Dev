const submitAction = document.getElementById('formDataDiri');

submitAction.addEventListener('submit', function(evnt) {
  const inputNama = document.getElementById('inputNama').value;
  const inputDomisili = document.getElementById('inputDomisili').value;
  const hiddenMessage = `Halo, ${inputNama}. Bagaimana cuaca di ${inputDomisili}?`;

  document.getElementById('messageAfterSubmit').innerText = hiddenMessage;
  evnt.preventDefault();
});