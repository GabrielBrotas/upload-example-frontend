# frontend
 
para a parte do react nao precisamos do Procfile pois o heroku tem uma funcionalidade chamada buildpacks é como se fosse uma serie de instruçoes que determina como uma aplicação deve funcionar.
para configurar o buildpacks vamos no heroku criar nossa nova aplicação para o frontend
ir em 'settings' e em buildpack vamos adicionar um buildpack

    colar esta url:
    mars/create-react-app-buildpack

esse buildpack vai executar o comando 'create-react-app' 

criar as variaveis ambiente do reeact
as variaveeis ambieente do react precisam de um prefixo em todas elas 'REACT_APP_ + nome da variavel'

REACT_APP_API_URL=http://localhost:8081 No local host
e no heroku
REACT_APP_API_URL=https://upload-photos-backend.herokuapp.com

depois fazer o mesmo processo do backend

ir em "Deploy" -> metodo github e colocar o nome do repositorio
também permitir deploys automaticos.

realizar o commit no github e o heroku vai reconhecer e comecar a rodar o servidor
