# Spotify Downloader 🎵

Um script em **TypeScript** para baixar playlists do Spotify como arquivos MP3, incluindo a capa do álbum e metadados (artista, álbum, título). O script busca os vídeos correspondentes no **YouTube** e utiliza ferramentas externas para baixar e processar os arquivos de áudio.

---

## Funcionalidades

- Buscar faixas de uma playlist do Spotify.
- Procurar vídeos correspondentes no YouTube.
- Baixar faixas em formato MP3 usando `yt-dlp`.
- Baixar a capa do álbum da música.
- Definir metadados da música usando `eyeD3`.
- Controle de progresso via spinners interativos (`nanospinner`).
- Evita downloads duplicados.

---

## Pré-requisitos

Antes de usar o script, você precisa instalar algumas ferramentas no sistema:

1. **Node.js** (>= 18)
2. **yt-dlp** – para download de vídeos do YouTube.
3. **eyeD3** – para editar metadados de arquivos MP3.
4. **npm** ou **yarn** – para instalar dependências do projeto.

Instalação no macOS com Homebrew:

```bash
brew install yt-dlp
brew install eye-d3
```

Instalação no Linux:

```bash
sudo apt update
sudo apt install yt-dlp eyed3
```

## Execução

Para executar o script para rodar os seguintes comandos:

```bash
npm install
npm run start:dev <link da playlist do spotify>
```