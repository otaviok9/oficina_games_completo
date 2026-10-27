const Console = require('../models/Console')
const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.modelo || !valores.marca || !valores.numeroSerie || !valores.tipoServico || !valores.idCliente) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }

    try {
        const cliente = await Cliente.findByPk(valores.idCliente)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente informado não existe!' })
        }

        await Console.create({
            modelo: valores.modelo,
            marca: valores.marca,
            numeroSerie: CryptoJS.AES.encrypt(valores.numeroSerie, CHAVE_SECRETA).toString(),
            tipoServico: valores.tipoServico,
            idCliente: valores.idCliente
        })
        return res.status(201).json({ message: 'Console cadastrado com sucesso!' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao cadastrar console!' })
    }
}

const listar = async (req, res) => {
    try {
        const consoles = await Console.findAll()
        let resultado = []

        consoles.forEach((el) => {
            resultado.push({
                codConsole: el.codConsole,
                modelo: el.modelo,
                marca: el.marca,
                numeroSerie: CryptoJS.AES.decrypt(el.numeroSerie, CHAVE_SECRETA).toString(CryptoJS.enc.Utf8),
                tipoServico: el.tipoServico,
                idCliente: el.idCliente
            })
        })

        return res.status(200).json(resultado)
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao listar consoles!' })
    }
}

//  aqui é uma consulta por termo, o número de série está criptografado,
// então descriptografa e compara
const consultarTermo = async (req, res) => {
    const termo = req.params.termo

    try {
        const consoles = await Console.findAll()
        let resultado = []

        consoles.forEach((el) => {
            const numeroSerie = CryptoJS.AES.decrypt(el.numeroSerie, CHAVE_SECRETA).toString(CryptoJS.enc.Utf8)
            if (numeroSerie.includes(termo)) {
                resultado.push({
                    codConsole: el.codConsole,
                    modelo: el.modelo,
                    marca: el.marca,
                    numeroSerie: numeroSerie,
                    tipoServico: el.tipoServico,
                    idCliente: el.idCliente
                })
            }
        })

        if (resultado.length === 0) {
            return res.status(404).json({ message: 'Console não encontrado!' })
        }

        return res.status(200).json(resultado)
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao consultar console!' })
    }
}

module.exports = { cadastrar, listar, consultarTermo }
