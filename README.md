# Projeto Health&Med: Guia de Configuração e Execução

O projeto **Health&Med** é uma plataforma de Telemedicina e Prontuário Eletrônico. Abaixo estão as etapas para configurar e executar o projeto:

## Pré-requisitos

Antes de começar, verifique se você possui os seguintes pré-requisitos:

1. **Node.js e npm**: Certifique-se de ter o Node.js instalado (recomendamos a versão LTS) juntamente com o npm. Você pode baixá-los em nodejs.org.

2. **Chave JWT (JWT_SECRET)**: O projeto utiliza tokens JWT para autenticação. Você precisará definir uma chave secreta no arquivo `.env` para assinar e verificar esses tokens.

## Configuração

Siga estas etapas para configurar o projeto:

1. Clone o repositório:

    ```bash
    git clone https://github.com/seu-usuario/health-med.git
    cd health-med
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Crie um arquivo `.env` na raiz do projeto e defina sua chave JWT secreta:

    ```env
    JWT_SECRET=SuaChaveSecretaAqui
    ```

   Substitua `SuaChaveSecretaAqui` pela sua própria chave secreta.

## Executando Localmente

Para iniciar o servidor localmente, execute o seguinte comando:

```bash
npm run start
```

## Executando via Docker

1. No terminal, navegue até a pasta onde está o Dockerfile e execute o seguinte comando para construir a imagem:
```docker build -t health-med .```
Isso criará uma imagem chamada health-med.
Executando o container: Agora, inicie um container 

2. Com base na imagem criada:
```docker run -p 3000:3000 -d health-med```
O servidor estará acessível em http://localhost:3000.

3. Pode validar a O swagger e realizar testes com:

http://localhost:3000/api
