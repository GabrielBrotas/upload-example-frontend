// styled components é uma biblioteca que permite criar componentes estilizados
import {createGlobalStyle} from 'styled-components'

// importar a estilização padrao da progress bar
import 'react-circular-progressbar/dist/styles.css'

// configaração para toda a aplicação
export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
    }
    body{
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        background: #7159c1;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
    }
    html, body, #root{
        height: 100%;
    }
`;