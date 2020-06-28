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

  }, [uploadFinish])


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

  }, [changeProgress])



  const processUpload = (uploadedFile) => {
    
    const data = new FormData();

  
    data.append('file', uploadedFile.file, uploadedFile.name)

    
    api.post('posts', data, {
      
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


  const handleUpload = files => {

  
    const newUploadedFile = files.map( file => ({
      file,
      id: uniqueId(),
      name: file.name,
   
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null, 
    }))

   
    setUploadedFiles(uploadedFiles.concat(newUploadedFile));

    setNewFile([...newUploadedFile])
    
  }


  useEffect( () => {
    
    newFiles.forEach( (file) => processUpload(file)) 
    
   
  }, [newFiles])

  
  const handleDelete = async id => {
    await api.delete(`posts/${id}`)
    setUploadedFiles( uploadedFiles.filter( file => file.id !== id));
  }

  

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

      
      uploadedFiles.forEach( file => URL.revokeObjectURL(file.preview))
    })

    
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
