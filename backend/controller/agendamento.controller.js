const Agendamento = require('../models/Agendamento')
const Cliente = require('../models/Cliente')
const Console = require('../models/Console')

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.data || !valores.hora || !valores.idConsole || !valores.idCliente) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }

    try {
        const cliente = await Cliente.findByPk(valores.idCliente)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente informado não existe!' })
        }

        const console_ = await Console.findByPk(valores.idConsole)
        if (!console_) {
            return res.status(404).json({ message: 'Console informado não existe!' })
        }

        await Agendamento.create(valores)
        return res.status(201).json({ message: 'Agendamento registrado com sucesso!' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao registrar agendamento!' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const agendamento = await Agendamento.findByPk(id)
        if (!agendamento) {
            return res.status(404).json({ message: 'Agendamento não encontrado!' })
        }

        await Agendamento.update(valores, { where: { codAgendamento: id } })
        return res.status(200).json({ message: 'Agendamento atualizado com sucesso!' })
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao atualizar agendamento!' })
    }
}

const listar = async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll({ order: [['data', 'ASC']] })
        return res.status(200).json(agendamentos)
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao listar agendamentos!' })
    }
}

module.exports = { cadastrar, atualizar, listar }
