import React, {useState, useEffect} from 'react';

// config para o consumo da API via axios
import api from './services/api'

// libraries ------

// lodash é um biblioteca que teem funções como uniqueId, debounce, etc. vamos querer um uniqueId para geerar id unico para os arquivos que fizerem upload
import {uniqueId} from 'lodash'
 
// vai fazer as correções de tamanhos ex: bytes-kb/mb...
import filesize from 'filesize' 

// styles ------
import GlobalStyle from './styles/global'
import {Container, Content} from './styles'

// componentes ------
import Upload from './components/Upload'
import FileList from './components/FileList'

function App() {

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [newFiles, setNewFile] = useState([])
  const [changeProgress, setChangeProgress] = useState([])
  const [uploadFinish, setUploadFinish] = useState([])

  
  // quando um upload for concluido...
  useEffect( () => {

    const uploadedFileId = uploadFinish[0]
    const key = uploadFinish[1]
    const url = uploadFinish[2]
    const uploadSuccess = uploadFinish[3]

    if(uploadSuccess){
      setUploadedFiles(
        uploadedFiles.map( file => {
          return file.id === uploadedFileId
          ? {...file, id: key, url, uploaded: true}
          : {...file} 
      })
      )
    } else {
      setUploadedFiles(
        uploadedFiles.map( file => {
          return file.id === uploadedFileId
          ? {...file, error: true}
          : {...file} 
      })
      )
    }

    // eslint-disable-next-line
  }, [uploadFinish])


  // quando um progresso for finalizado...
  useEffect( () => {

    const id = changeProgress[1]
    const progress = changeProgress[0]

    if(progress !== 100) {
      setUploadedFiles(
        uploadedFiles.map( file => {
          return file.id === id
          ? {...file, progress}
          : {...file} 
      })
      )
    } 

    // eslint-disable-next-line
  }, [changeProgress])


  // durante o processo de upload de cada arquivo...
  const processUpload = (uploadedFile) => {
    
    // FormData é como se estivesse dando submit de um form html atraves do JS, o FormData é o objeto que o html transforma os nossos campos do formulario dentro do JS.
    const data = new FormData();

    // colocar o campo 'file' que foi o nome dado no backend ao enviar um upload, o campo uploadedFile.file que são os dados do arquivo que vao para o backend
    data.append('file', uploadedFile.file, uploadedFile.name)

    // enviar para /posts o formulario 'data' que contem a imagem e pegar o progresso do upload
    api.post('posts', data, {
      // monitorar o quanto do upload foi processado
      onUploadProgress: e => {
        
        const progress = parseInt(Math.round( (e.loaded * 100) / e.total ))
  
        setChangeProgress([progress, uploadedFile.id])

      }
    
    }).then( (response) => {

      const {data} = response

      setUploadFinish([uploadedFile.id, data._id, data.url, true])
    
      setNewFile([])
      
    }).catch( (error) => {
      setUploadFinish([uploadedFile.id, data.key, data.url, false])
      setNewFile([])
    })

  
  }

  // ao arrastar um arquivo para upload
  const handleUpload = files => {

    //  file => ({}) para retornar um objeto
    const newUploadedFile = files.map( file => ({
      file,
      id: uniqueId(),
      name: file.name,
      // os arquivos vem em bytes, vamos transformalos em kb-mb-etc
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file), // url de preview antes de a imagem chegar no servidor
      progress: 0,
      uploaded: false,
      error: false,
      url: null, // url que vai redirecionar para a imagem, inicia como null pois só vai ser preenchida depois de preenchido o upload
    }))

    //  para nao sobrepor o estado e sempre adicionar mais informações
    setUploadedFiles(uploadedFiles.concat(newUploadedFile));

    setNewFile([...newUploadedFile])
    
  }

  // para cada novo arquivo que for fazer upload...
  useEffect( () => {
    
    newFiles.forEach( (file) => processUpload(file)) 
    
    // eslint-disable-next-line
  }, [newFiles])

  // deletar um arquivo que foi feito upload da API
  const handleDelete = async id => {
    await api.delete(`posts/${id}`)
    setUploadedFiles( uploadedFiles.filter( file => file.id !== id));
  }

  
  // renderizar os arquivos que estao no servidor na tela
  useEffect( () =>{ 

    api.get('posts').then(files => {
      const {data} = files
      
      setUploadedFiles( data.map( file => ({
        id: file._id,
        name: file.name,
        readableSize: filesize(file.size),
        preview: file.url,
        uploaded: true,
        url: file.url
      })))

      // deletar todos os objects url criados anteriormente de o upload ser feito para o preview, deletar para nao pesar o servidor
      uploadedFiles.forEach( file => URL.revokeObjectURL(file.preview))
    })

    // eslint-disable-next-line
  }, [])

  return <Container>

    <Content>

      <Upload onUpload={handleUpload} />
      

      {!!uploadedFiles.length && (
        <FileList  files={uploadedFiles} onDelete={handleDelete}/>
      )}
    </Content>

    <GlobalStyle />

  </Container>
    
  
}

export default App;
