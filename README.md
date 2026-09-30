# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Publicar no GitHub Pages

O projeto já vem pronto para publicar no GitHub Pages automaticamente:

1. **Suba o código para o GitHub.** No Lovable, vá em **Configurações do projeto → GitHub → Conectar** (Git sync) e escolha/crie o repositório — cada mudança feita aqui vai direto para o repositório. Ou, se preferir, crie o repositório no GitHub e faça o push manual do código.
2. **Ative o Pages pelo Actions.** No GitHub, abra o repositório em **Settings → Pages** e em "Build and deployment → Source" escolha **GitHub Actions**.
3. **Pronto.** O workflow `.github/workflows/deploy-pages.yml` roda a cada push em `main` e publica o site em `https://<seu-usuario>.github.io/<nome-do-repo>/`. Você também pode dispará-lo manualmente na aba **Actions → Deploy para GitHub Pages → Run workflow**.

### Build estático (opcional, local)

Para gerar o site estático na sua máquina (pasta `dist/client`):

```sh
bun install
node scripts/build-static.mjs          # publica na raiz
BASE_PATH=/nome-do-repo/ node scripts/build-static.mjs   # publica em subpasta (GitHub Pages de projeto)
```

O build estático roda em modo SPA (sem servidor): tudo funciona no navegador e os dados continuam salvos no `localStorage` do navegador de quem usa.
