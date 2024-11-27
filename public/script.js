const form = document.getElementById('user-form');

form.addEventListener('submit', (event) => {
    event.preventDefault();


    // Pra poder limpar o formulário depois de submetido
    const nameElement = document.getElementById('name');
    const emailElement = document.getElementById('email');

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: nameElement.value,
            email: emailElement.value
        }),
    })
        .then(response => response.text())
        .then(data => {
            alert(data)

            // Aqui limpa o formulário depois que foi submetido
            nameElement.value = ""
            emailElement.value = ""
        })
        .catch(error => console.error('Erro:', error));
});
