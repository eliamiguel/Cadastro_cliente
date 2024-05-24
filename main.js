const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () =>{
    limparCampos()
    document.getElementById('modal').classList.remove('active')
}




// banco de dados/LocalStorage
const getLocalStorage = ()=> JSON.parse(localStorage.getItem('dbCliente')) ?? [];
const setLocalStorage = (dbCliente)=> localStorage.setItem('dbCliente', JSON.stringify(dbCliente));


const lerCliente = ()=> getLocalStorage()


const criarCliente = (cliente)=>{
    const dbCliente = lerCliente()
    dbCliente.push(cliente)
    setLocalStorage(dbCliente)
}

const editarCliente =(index, cliente)=>{
    const dbCliente = lerCliente()
    dbCliente[index] = cliente
    setLocalStorage(dbCliente)
}

const deletarCliente =(index)=>{
    const dbCliente = lerCliente()
    dbCliente.splice(index, 1)
    setLocalStorage(dbCliente)
}


// interação com lajout


const limparCampos =()=>{
    const campos = document.querySelectorAll('.modal-field')
    campos.forEach( campo => campo.value = '')
}
const validarCampos = ()=> {
    return document.getElementById('form').reportValidity()
}
const salvarCliente = ()=>{
    if(validarCampos()){
     const cliente = {
        nome: document.getElementById( 'nome').value,
        email: document.getElementById( 'email').value,
        celular: document.getElementById( 'celular').value,
        cidade: document.getElementById( 'cidade').value,
     }
     const index = document.getElementById('nome').dataset.index
      if (index === 'novo') {
        criarCliente(cliente)
        atualizarTabela()
        closeModal()
      }else{
        editarCliente(index, cliente)
        atualizarTabela()
        closeModal()

      }

     
    }
    
}


const limparTabela = ()=> {
    const linhas = document.querySelectorAll('#tabelaCliente> tbody tr')
    linhas.forEach( linha => linha.parentNode.removeChild(linha))
 
} 
const atualizarTabela = ()=>{
   const dbCliente = lerCliente()
   limparTabela()
   dbCliente.forEach( crearLinha)
}

const crearLinha = (cliente, indice) =>{
    const novaLinha = document.createElement('tr')
    novaLinha .innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.email}</td>
                <td>${cliente.celular}</td>
                <td>${cliente.cidade}</td>
                <td>
                    <button type="button" class="button green" id='editar-${indice}'>editar</button>
                    <button type="button" class="button red" id='apagar-${indice}'>excluir</button>
                </td>
    `

    document.querySelector('#tabelaCliente> tbody').appendChild(novaLinha)
}

const preencherCampos = (cliente)=>{
   
    document.getElementById('nome').value = cliente.nome
    document.getElementById('email').value = cliente.email
    document.getElementById('celular').value = cliente.celular
    document.getElementById('cidade').value = cliente.cidade
    document.getElementById('nome').dataset.index = cliente.index
}
const editaOCliente = (index)=>{
    const cliente = lerCliente()[index]
    cliente.index = index
    preencherCampos(cliente )
    openModal()
}

const editaEApaga = (evento) =>{

    if(evento.target.type === 'button'){
        const [acao, index] = evento.target.id.split('-')

        if( acao == 'editar'){
            editaOCliente(index)
        }else{

            const cliente = lerCliente()[index]
            const response = confirm(`Deseja resalmente excluir o cliente ${cliente.nome}`)
            if(response){
                deletarCliente(index)
                atualizarTabela()
            } 
            
            

        }

    }



}


atualizarTabela()

document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal);

document.getElementById('modalClose')
    .addEventListener('click', closeModal);

document.getElementById('salvar').addEventListener('click', salvarCliente )

document.querySelector('#tabelaCliente> tbody').addEventListener('click', editaEApaga)