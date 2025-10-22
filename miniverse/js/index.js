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
//Para dar destaque na marca selecionada na página de produtos
document.addEventListener("DOMContentLoaded", () =>{
  const hash = window.location.hash;

  if(hash){
    const section = document.querySelector(hash);
    if(section){
      const cores = {
        marvel: "rgba(255, 0, 0, 0.8)",
        dc: "rgba(0, 0, 255, 0.8)",
        dragonball: "rgba(255, 140, 0, 0.8)",
        tlou: "rgba(128, 64, 0, 0.8)",
        starwars: "rgba(255, 215, 0, 0.8)",
        seresmito: "rgba(138, 43, 226, 0.8)"
      };

      const marca = hash.replace("#", "");
      const cor = cores[marca] || "rgba(23, 146, 123, 1)";

      section.style.boxShadow = `0 0 20px 5px ${cor}`;
      section.classList.add("destaque");

      section.scrollIntoView({behavior: "smooth"});

      setTimeout(()=>{
        section.classList.remove("destaque");
      }, 3000);
    }
  }
});