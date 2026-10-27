const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.nome || !valores.email || !valores.senha || !valores.cpf || !valores.celular) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }

    if (valores.cpf.length !== 11) {
        return res.status(400).json({ message: 'O CPF deve conter exatamente 11 dígitos!' })
    }

    try {
        await Cliente.create({
            nome: valores.nome,
            email: valores.email,
            senha: CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString(),
            cpf: CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString(),
            celular: valores.celular
        })
        return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao cadastrar cliente!' })
    }
}

const listar = async (req, res) => {
    try {
        const clientes = await Cliente.findAll()
        let resultado = []

        clientes.forEach((el) => {
            resultado.push({
                codCliente: el.codCliente,
                nome: el.nome,
                email: el.email,
                cpf: CryptoJS.AES.decrypt(el.cpf, CHAVE_SECRETA).toString(CryptoJS.enc.Utf8),
                celular: el.celular
            })
        })

        return res.status(200).json(resultado)
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao listar clientes!' })
    }
}

const consultar = async (req, res) => {
    const id = req.params.id
    try {
        const cliente = await Cliente.findByPk(id)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado!' })
        }

        return res.status(200).json({
            codCliente: cliente.codCliente,
            nome: cliente.nome,
            email: cliente.email,
            cpf: CryptoJS.AES.decrypt(cliente.cpf, CHAVE_SECRETA).toString(CryptoJS.enc.Utf8),
            celular: cliente.celular
        })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao consultar cliente!' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const cliente = await Cliente.findByPk(id)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado!' })
        }

        if (valores.cpf) {
            if (valores.cpf.length !== 11) {
                return res.status(400).json({ message: 'O CPF deve conter exatamente 11 dígitos!' })
            }
            valores.cpf = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        }

        if (valores.senha) {
            valores.senha = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()
        }

        await Cliente.update(valores, { where: { codCliente: id } })
        return res.status(200).json({ message: 'Cliente atualizado com sucesso!' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao atualizar cliente!' })
    }
}

const apagar = async (req, res) => {
    const id = req.params.id
    try {
        const cliente = await Cliente.findByPk(id)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado!' })
        }

        await Cliente.destroy({ where: { codCliente: id } })
        return res.status(200).json({ message: 'Cliente excluído com sucesso!' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao apagar cliente!' })
    }
}

module.exports = { cadastrar, listar, consultar, atualizar, apagar }
