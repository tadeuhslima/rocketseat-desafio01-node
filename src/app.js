const express = require("express");
const { uuid , isUuid }  = require('uuidv4')
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());


const repositories = [];


function ValidadeRepositorieId(request , response, next){
  const { id } = request.params;
  if (!isUuid(id)){
    return response.status(400).json({error: "O id Informado é inválido"})
  }
  return next();
}

app.use(['/repositories/:id' , '/repositories/:id'] , ValidadeRepositorieId);

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title , url , techs } = request.body;

  const likes = 0;
  const repository = { id: uuid() , title , url , techs , likes}

  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title , url , techs } = request.body;


  console.log('request.body' , request.body)
  const repositorieIndex = repositories.findIndex(repository => repository.id === id)

  if(repositorieIndex < 0 ){
    return response.status(400).json(
      {error: "Repositório não encontrado."}
      )
    }


  /**
  *
  * TIVE A NECESSIDADE DE CRIAR ESSE LOOP
  * => POIS CASO VOCÊ NÃO MANDE UM PARÂMETRO ELE IRIA SER SETADO COMO UNDEFINED
  * => NÃO SERIA A EXPERIÊNCIA DE USUÁRIO PERFEITA
  * => FIZ A VALIDAÇÃO PARA SÓ ALTERAR SE TIVER ALTERAÇÃO
  * => NÃO IRÁ ALTERAR NUNCA ID NEM LIKES
  *
  */

  let repository = repositories[repositorieIndex];
  Object.entries(repositories[repositorieIndex]).forEach(([key, value]) => {
    if(key !== 'id' && key !== 'likes' && request.body[key] !== undefined){
      if(repositories[repositorieIndex][key] !== request.body[key]){
        repository = { ...repository , [key]: request.body[key] }
      }
    }
  });

  repositories[repositorieIndex] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(repository => repository.id === id)

  if(repositorieIndex < 0 ){
    return response.status(400).json(
      {error: "Repositório não encontrado."}
    )
  }

  repositories.splice( repositorieIndex , 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id)

  if(!repository){
    return response.status(400).json(
      {error: "Repositório não encontrado para ser Curtido."}
    )
  }

  repository.likes++;

  return response.json(repository)

});


module.exports = app;

