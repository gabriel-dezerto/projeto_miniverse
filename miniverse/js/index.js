const exampleModal = document.getElementById('exampleModal')
if (exampleModal) {
  exampleModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    const recipient = button.getAttribute('data-bs-whatever')
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    const modalTitle = exampleModal.querySelector('.modal-title')
    const modalBodyInput = exampleModal.querySelector('.modal-body input')

    modalTitle.textContent = `New message to ${recipient}`
    modalBodyInput.value = recipient
  })
}
//-----------------------------------------------------------------------------------------------------------------------------------
//Para a página de produtos abrir de acordo com a marca

document.querySelectorAll('.dropdown-item').forEach(item =>{
  item.addEventListener('click', (eve) =>{
    eve.preventDefault();

    //pega a marca pelo atributo "data-marca"
    const marca = item.getAttribute('data-marca');
    
    //bloqueia as outras seções enquanto uma estiver aberta
    document.querySelectorAll('.marca-section').forEach(sec => sec.classList.add('d-none'));

    //mostra a marca escolhida
    document.getElementById(marca).classList.remove('d-none');

    window.addEventListener('DOMContentLoaded', () =>{
      const hash = window.location.hash.replace('#', '');

      if(hash){
        document.querySelectorAll('.marca-section').forEach(sec => sec.classList.add('d-none'));
        const secao = document.getElementById(hash);
        if(secao){
          secao.classList.remove('d-none');
        }
      }
    })
  })
})

//-------------------------------------------------------------------------------------------------------------------------------------------