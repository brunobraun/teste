import { StyleSheet } from 'react-native';

const EYHEE_VERDE = '#8FC73E';

// ESTILOS DA SCHEILA
 const fundo = '#F5F6F8';
 const azulzinho = '#51D9E7';
const letras = '#555555';

export default StyleSheet.create({
    // Orientação do Anjo
    orientacao: {
        fontSize:16,
        paddingBottom:10
    },
    pergunta: {
        fontSize: 14,
        color: EYHEE_VERDE,
        paddingBottom:5,
        paddingTop:5
    },
    vresposta: {
        flexDirection:'row',
        alignItems:'center'
    },
    resposta: {
        fontSize: 12,
    },
    parabens: {
        color: EYHEE_VERDE,
        fontSize: 20,
        alignSelf:'center',
        justifyContent:'center',
    }



    // Voluntários
    
});