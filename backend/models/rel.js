const Cliente = require('./Cliente')
const Agendamento = require('./Agendamento')
const Console = require('./Console')


Cliente.hasMany(Console, { 
    foreignKey: 'idCliente', 
    as: 'consoleCliente', 
    onDelete: 'CASCADE' })

Console.belongsTo(Cliente, {
    foreignKey: 'idCliente', 
    as: 'clienteConsole',
    allowNull: false
})

Console.hasMany(Agendamento, {
    foreignKey: 'idConsole',
    as: 'agendamentosConsole',
    onDelete: 'CASCADE'
})

Agendamento.belongsTo(Console, {
    foreignKey: 'idConsole', 
    as: 'consoleAgendamento',
    allowNull: false
})

Cliente.hasMany(Agendamento, {
    foreignKey: 'idCliente',
    as: 'agendamentosCliente',
    onDelete: 'CASCADE'
})
Agendamento.belongsTo(Cliente, {
    foreignKey: 'idCliente',
    as: 'clienteAgendamento',
    allowNull: false
})

module.exports = { Cliente, Console, Agendamento }