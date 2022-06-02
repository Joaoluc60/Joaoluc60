const {
default:
makeWASocket,
DisconnectReason,
useSingleFileAuthState
} = require("@adiwajshing/baileys")

const pino = require("pino")
const { banner } = require("./lib/functions")
const chalk = require("chalk")

prefix = "#"
ownerNumber = "5516992961811"

async function startAlice() {
  
const { state, saveState } = useSingleFileAuthState('qrcode.json')

console.log(banner.string)

const client = makeWASocket({
logger: pino({
level: "silent"
}),
printQRInTerminal: true,
auth: state
})

client.ev.on ('creds.update', saveState)

client.ev.on("connection.update", (update) => {
const { connection, lastDisconnect } = update
if(connection === "close") {
const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
console.log("Conexão fechada devido a:", lastDisconnect.error, ",Tentando Reconectar...", shouldReconnect)
if(shouldReconnect) {
startAlice()
}
} else if(connection === "open") {
console.log("Conectado com Sucesso")
}
})

client.ev.on("messages.upsert", async m => {
try {
const mek = m.messages[0]
await client.sendReadReceipt(mek.key.remoteJid, mek.key.participant, [mek.key.id])
if (!mek.key.participant) mek.key.participant = mek.key.remoteJid
mek.key.participant = mek.key.participant.replace(/:[0-9]+/gi, "")
if (!mek.message) return
const fromMe = mek.key.fromMe
const content = JSON.stringify(mek.message)
const from = mek.key.remoteJid
const type = Object.keys(mek.message).find((key) => !["senderKeyDistributionMessage", "messageContextInfo"].includes(key))

const body = (type === "conversation" &&
mek.message.conversation.startsWith(prefix)) ?
mek.message.conversation: (type == "imageMessage") &&
mek.message[type].caption.startsWith(prefix) ?
mek.message[type].caption: (type == "videoMessage") &&
mek.message[type].caption.startsWith(prefix) ?
mek.message[type].caption: (type == "extendedTextMessage") &&
mek.message[type].text.startsWith(prefix) ?
mek.message[type].text: (type == "listResponseMessage") &&
mek.message[type].singleSelectReply.selectedRowId ?
mek.message.listResponseMessage.singleSelectReply.selectedRowId: (type == "templateButtonReplyMessage") ?
mek.message.templateButtonReplyMessage.selectedId: (type === "messageContextInfo") ?
mek.message[type].singleSelectReply.selectedRowId: (type == "client.sendMessageButtonMessage") &&
mek.message[type].selectedButtonId ?
mek.message[type].selectedButtonId: (type == "stickerMessage") && ((mek.message[type].fileSha256.toString("base64")) !== null && (mek.message[type].fileSha256.toString("base64")) !== undefined) ? (mek.message[type].fileSha256.toString("base64")): ""

const budy = (type === "conversation") ?
mek.message.conversation: (type === "extendedTextMessage") ?
mek.message.extendedTextMessage.text: ""

const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
const isCmd = body.startsWith(prefix)
const owner = `${ownerNumber}@s.whatsapp.net`
const isGroup = from.endsWith("@g.us")
const groupMetadata = isGroup ? await client.groupMetadata(from): ""
const groupName = isGroup ? groupMetadata.subject: ""
const sender = isGroup ? mek.key.participant: mek.key.remoteJid
const evall = / /g.test(body) ? body.replace(body.split(" ")[0] + " ", "").trim() : ""
const pushname = mek.pushName ? mek.pushName: ""
const isOwner = owner.includes(sender)

color = (text, color) => {
return !color ? chalk.blueBright(text) : chalk.keyword(color)(text)
}

const reply = (text) => {
client.sendMessage(from, {
text: text
}, { quoted: mek})
}

if (isGroup && isCmd && !fromMe) console.log(`
${color(`Comando em grupo`)}
${color(`Comando:`)} ${command}
${color(`Número:`)} ${sender.split("@")[0]}
${color(`Grupo:`)} ${groupName}
${color(`Nome:`)} ${pushname}
`)

if (isGroup && !isCmd && !fromMe) console.log(`
${color(`Mensagem em grupo`)}
${color(`Comando:`)} Não
${color(`Número:`)} ${sender.split("@")[0]}
${color(`Grupo:`)} ${groupName}
${color(`Nome:`)} ${pushname}
`)

if (!isGroup && isCmd && !fromMe) console.log(`
${color(`Comando no pv`)}
${color(`Comando:`)} ${command}
${color(`Número:`)} ${sender.split("@")[0]}
${color(`Grupo:`)} Não
${color(`Nome:`)} ${pushname}
`)

if (!isGroup && !isCmd && !fromMe) console.log(`
${color(`Mensagem no pv`)}
${color(`Comando:`)} Não
${color(`Número:`)} ${sender.split("@")[0]}
${color(`Grupo:`)} Não
${color(`Nome:`)} ${pushname}
`)

switch (command) {

case "eval": // By tobi ( se tirar é gay, e transa com animais 🤮 )
if (!isOwner) return reply("Este comando é só para meu dono")
try {
eval(`(async () => {
try {
${budy.slice(5)}
} catch(err) {
reply(String(err))
console.log(err)
}
})()`)
} catch(err) {
reply(String(err))
console.log(err)
}
break

default:

if (isCmd) return reply("Comando não encontrado :/")

if (budy.includes("Bot") || (budy.includes("bot"))) {
if (!fromMe) return reply("Oi")
}

}

} catch (e) {
console.log(e)
}

})

}
startAlice()