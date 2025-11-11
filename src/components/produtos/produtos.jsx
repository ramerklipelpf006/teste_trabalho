import {useState, useEffect} from 'react';
import Alerta from '../alerta';

function Produto() {
    const [listaObj, setListaObj] = useState([]);
    const [alerta, setAlerta] = useState({status: "", message: ""});
    const [editar, setEditar] = useState(false);
    const [objeto, setObjeto] = useState({
        "idproduto": "", "nmproduto": "", "dsproduto": "", "qtproduto": "", "vlproduto": "", "dtcadastro": ""
    });

    const novoObjeto = () => {
        setEditar(false);
        setAlerta({status: "", message: ""});
        setObjeto({
            "idproduto": 0,
            "nmproduto": "",
            "dsproduto": "",
            "qtproduto": "",
            "vlproduto": "",
            "dtcadastro": new Date().toISOString().slice(0, 10)
       });
    }

    const editaObjeto = async codigo => {
        setEditar(true);
        setAlerta({status:"", message: ""});
        await fetch(`http://127.0.0.1:3001/produtos/${codigo.idproduto}`)
            .then(response => response.json())
            .then(data => setObjeto(data))
            .catch(error => console.log(error));
        
        }

    const acaoCadastrar = async e => {
        e.preventDefault();
        const metodo = editar ? "PUT" : "POST";
        
        try {
            await fetch("http://127.0.0.1:3001/addProdutos/", {
                method: metodo,
                headers: {"Content-Type": "application/JSON"},
                body: JSON.stringify(objeto)
            }).then(response => response.json())
              .then( json => {
                setAlerta({status: json.status, message: json.message});
                setObjeto(json.objeto);

                if (!editar) {
                    setEditar(true)
                }
              })
        } catch (error) {
            console.log("Erro: " + error)
        }
        recuperaProdutos();
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setObjeto({...objeto, [name]: value});
    }

    const Remover = async objeto => {
        if (window.confirm("Deseja remover este produto?")) {
            try {
                await fetch (`http://127.0.0.1:3001/produtos/${objeto.idproduto}`, 
                {
                    method: "DELETE"
                }).then(response => response.json())
                  .then(json => setAlerta({status: json.status, message: json.message}))

                  recuperaProdutos();
            } catch (error) {
                console.log("Erro: " + error)
            }
        }
    }

    const recuperaProdutos = async () => {
        await fetch(`http://127.0.0.1:3001/produto`).then(Response => Response.json())
                                            .then(data => setListaObj(data))
                                            .catch(err => console.log('Erro: ' + err))
    };

    useEffect(() => {
        recuperaProdutos();
    }, []);

    return (
        <>
            <div style={{padding: '20px'}}>
                <button type="button" className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#modalEdicao" onClick={() => novoObjeto()}>
                    Novo <i className='bi bi-plus-square'></i>
                </button>
                <h1>Produtos</h1>
                <Alerta alerta={alerta} />
                {listaObj.length == 0 && <h1>Nenhum produto</h1>}
                {listaObj.length > 0 &&
                    (
                        <div className='table-responsive'>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th scope="col" style={{textAlign: 'center'}}>Ações</th>
                                        <th scope="col">Produto</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Descrição</th>
                                        <th scope="col">Quantidade</th>
                                        <th scope="col">Valor</th>
                                        <th scope="col">Data Inclusao</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaObj.map(objeto => (
                                        <tr key={objeto.idproduto}>
                                            <td>
                                                <button className="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalEdicao" onClick={() => editaObjeto(objeto)}>
                                                    <i className='bi bi-pencil-square'></i>
                                                </button>
                                                <button className="btn btn-danger" onClick={() => Remover(objeto)}>
                                                    <i className='bi bi-trash'></i>
                                                </button>
                                            </td>
                                            <td scope='row'>
                                                {objeto.idproduto}
                                            </td>
                                            <td scope='row'>
                                                {objeto.nmproduto}
                                            </td>
                                            <td scope='row'>
                                                {objeto.dsproduto}
                                            </td>
                                            <td scope='row'>
                                                {objeto.qtproduto}
                                            </td>
                                            <td scope='row'>
                                                {objeto.vlproduto}
                                            </td>
                                            <td scope='row'>
                                                {objeto.dtcadastro}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="modal fade" id="modalEdicao" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Categoria</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <form id="formulario" onSubmit={acaoCadastrar}>
                                            <div className="modal-body">
                                                <Alerta alerta={alerta} />
                                                <div className="form-group">
                                                    <label htmlFor="txtCodido" className="form-label">
                                                        Código
                                                    </label>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        className="form-control"
                                                        id="txtCodido"
                                                        name="idproduto"
                                                        value={objeto.idproduto}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="txtNome" className="form-label">
                                                        Nome
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="txtNome"
                                                        name="nmproduto"
                                                        value={objeto.nmproduto}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="txtDescricao" className="form-label">
                                                        Descrição
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="txtDescricao"
                                                        name="dsproduto"
                                                        value={objeto.dsproduto}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div> 
                                                <div className="form-group">
                                                    <label htmlFor="txtEstoque" className="form-label">
                                                        Estoque
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="txtEstoque"
                                                        name="qtproduto"
                                                        value={objeto.qtproduto}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>    
                                                <div className="form-group">
                                                    <label htmlFor="txtValor" className="form-label">
                                                        Valor
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="txtValor"
                                                        name="vlproduto"
                                                        value={objeto.vlproduto}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>  
                                                <div className="form-group">
                                                    <label htmlFor="txtDataCadastro" className="form-label">
                                                        Data de cadastro
                                                    </label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        id="txtDataCadastro"
                                                        name="dtcadastro"
                                                        value={objeto.dtcadastro}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>                                                                                                           
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                                <button type="submit" className="btn btn-success">
                                                    Salvar  <i className="bi bi-save"></i>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    );
}


export default Produto;