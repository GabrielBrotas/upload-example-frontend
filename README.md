# Frontend
  Projeto da rocketseat para fazer deploy de imagens na aws s3. Neste repositorio mostro por escrito o passo a passo de fazer o deploy do servidor e os codigos comentados mostrando a funcionalidade de cada componente.
  
  
  ![imagem](https://github.com/GabrielBrotas/upload-photos-frontend/blob/master/public/images/app.JPG)
  
  
 ## Deploy na Heroku
  Para a parte do frontend react nao precisamos do arquivo Procfile pois o heroku tem uma funcionalidade chamada buildpacks é como se fosse uma série de instruções que determina como uma aplicação deve funcionar.
  Para configurar o buildpacks vamos no heroku criar nossa nova aplicação para o frontend;
  Ir em 'settings' -> buildpack e vamos adicionar um buildpack;

    colar esta url:
    mars/create-react-app-buildpack

  Esse buildpack vai executar o comando 'create-react-app' para rodar nosso app.

  Feito isso vamos criar as variaveis ambientes;
  As variaveis ambiente do react precisam de um prefixo em todas elas 'REACT_APP_ + nome da variavel'
  exemplo:
   
    REACT_APP_API_URL=http://localhost:8081 <- No local host

    REACT_APP_API_URL=https://upload-photos-backend.herokuapp.com  <- link do app no heroku

  Depois fazer o mesmo processo do backend

  Ir em "Deploy" -> metodo github e colocar o nome do repositorio
  Também permitir deploys automaticos.
  E realizar o commit no github e o heroku vai reconhecer e comecar a rodar o servidor.
