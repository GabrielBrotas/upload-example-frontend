import React from 'react'

// extensao para fazer a zona de upload, caixinha onde o usuario vai arrastar a imagem
import Dropzone from 'react-dropzone'

import {DropContainer, UploadMessage} from './styles'

export default function Upload(props){

    const renderDragMessage = (isDragActive, isDragReject) => {
        
        // nao estiver arrastando nada
        if(!isDragActive){
            return <UploadMessage>Arraste arquivos aqui...</UploadMessage>
        }

        // arrastando um arquivo invalido
        if(isDragReject){
            return <UploadMessage type="error">Arquivo não surpotado</UploadMessage>
        }

        return <UploadMessage type="success">Solte os arquivos aqui</UploadMessage>
    }

    return (


        // accept = image/* -> permitir upload todo tipo de imagem
        // onDropAccepted = ao fazer um novo upload
        <Dropzone accept="image/*" onDropAccepted={props.onUpload}>

            {/* pegar as funcoes do dropzone */}
            { ({getRootProps, getInputProps, isDragActive, isDragReject}) => (
            
            //Drop container vai ser nossa zona de arrastar arquivos, vamos ter que passar funçoes para ela 
            <DropContainer
                {...getRootProps()} // elemento no qual vai ter as propriedades de upload, vai adicionar as propriedades no DropContainer para que o usuario tenha a possibilidade de arrastar um arquivo para o elemento
                isDragActive={isDragActive} // Saber se quando estiver arrastando a imagem por cima do elemento vai estar true 
                isDragReject={isDragReject} // Quando estiver passando um arquivo que não seja imagem... faz isso baseado na propriedade accept False
            >
                {/* todo elemento de upload precisa ter um input, obrigatorio, vamos passar as propriedades do getInputProps para ele porem vai ser um input invisivel nesse caso */}
                <input {...getInputProps()} />

                {renderDragMessage(isDragActive, isDragReject)}

            </DropContainer>
            
            )}

        </Dropzone>

    )
}