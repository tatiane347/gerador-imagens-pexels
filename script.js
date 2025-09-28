const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('prompt-input');
const loadingText = document.getElementById('loading');
const generatedImage = document.getElementById('generated-image');
// Novos elementos
const colorSelect = document.getElementById('color-select'); 

// **ATENÇÃO:** Mantenha sua chave de API do Pexels aqui
const pexelsApiKey = 'j8pZfUXvbXO0JsfkvZyvIPUt9h3PullQGk8v9ikpyViylrQHGymtKnUk'; 

generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (prompt === '') {
        alert('Por favor, digite um termo de pesquisa (ex: montanha).');
        return;
    }

    // 1. Coleta os novos valores
    const selectedColor = colorSelect.value;
    const selectedOrientation = document.querySelector('input[name="orientation"]:checked').value;

    generatedImage.classList.add('hidden');
    loadingText.classList.remove('hidden');
    generatedImage.src = '';
    
    loadingText.textContent = `Buscando imagem Pexels para: "${prompt}"...`;

    // 2. Constrói a URL de pesquisa com os novos parâmetros
    let apiUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(prompt)}&per_page=1`;

    if (selectedColor) {
        apiUrl += `&color=${selectedColor}`;
    }
    if (selectedOrientation) {
        apiUrl += `&orientation=${selectedOrientation}`;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': pexelsApiKey 
            }
        });

        if (!response.ok) {
            throw new Error(`Erro API Pexels (Status: ${response.status}). Sua chave ainda é válida?`);
        }

        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
            const imageUrl = data.photos[0].src.medium;
            
            loadingText.classList.add('hidden');
            generatedImage.src = imageUrl;
            generatedImage.alt = prompt;
            generatedImage.classList.remove('hidden');

        } else {
            // Este alerta é importante: avisa que não encontrou NADA com a cor/orientação escolhida.
            alert(`Nenhuma imagem encontrada para o termo "${prompt}" com as especificações de cor/orientação selecionadas. Tente mudar os filtros.`);
            loadingText.classList.add('hidden');
        }

    } catch (error) {
        alert(`Ocorreu um erro: ${error.message}`);
        loadingText.classList.add('hidden');
        generatedImage.classList.add('hidden');
    }
});
