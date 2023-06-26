//INCOMPLETE, COMMENTS IN SPANGLISH

process.env.abcxyz
// BTW, I will import the required stuff too
const crypto = require("crypto"), SHA256 = message => crypto.createHash("sha256").update(message).digest("hex"); //Crypto para operaciones, SHA256 devuelve en hash de un mensaje en hex
const { Block, Transaction, JeChain } = require("./jechain"); //improrta funciones para implementar la cadena
const EC = require("elliptic").ec, ec = new EC("secp256k1"); //crea una instancia de curva elíptica (método criptográfico) para firmas digitales

const MINT_PRIVATE_ADDRESS = "";
const MINT_KEY_PAIR = ec.keyFromPrivate(MINT_PRIVATE_ADDRESS, "hex");
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");

// Your key pair
const privateKey = process.env.PRIVATE_KEY || ""; //clave privada para el usuario actual (variable de entorno)
const keyPair = ec.keyFromPrivate(privateKey, "hex");
const publicKey = keyPair.getPublic("hex");

// The real new code
const WS = require("ws"); //importa web socket

const PORT = process.env.PORT || 3000;
const PEERS = process.env.PEERS ? process.env.PEERS.split(",") : []; //lista de usuarios
const MY_ADDRESS = process.env.MY_ADDRESS || "ws://localhost:3000";
const server = new WS.Server({ port: PORT });

console.log("Listening on PORT", PORT);

// I will add this one line for error handling:
process.on("uncaughtException", err => console.log(err));

//MINTING ADDRESS (se debe cambiar?)
const initalCoinRelease = new Transaction(MINT_PUBLIC_ADDRESS, "04719af634ece3e9bf00bfd7c58163b2caf2b8acd1a437a3e99a093c8dd7b1485c20d8a4c9f6621557f1d583e0fcff99f3234dd1bb365596d1d67909c270c16d64", 100000000);

//Function to generate messages for convenience
function produceMessage(type, data) {
    return { type, data }
}

// THE CONNECTION LISTENER
server.on("connection", async(socket, req) => {
    // Listens for messages
    socket.on("message", message => {
        // Parse the message from a JSON into an object 
        const _message = JSON.parse(message);

        switch(_message.type) {
            case "TYPE_HANDSHAKE":
                const nodes = _message.data;

                nodes.forEach(node => connect(node)) //establece una conexión a cada nodo

            // We will need to handle more types of messages in the future, so I have used a switch-case.
        }
    })
});

// THE CONNECT FUNCTION
async function connect(address) { //para conectar con un nodo específico
    // Get the socket from address
    const socket = new WS(address);

    // Connect to the socket using the "open" event
    socket.on("open", () => {
        // Send our address to the target 
        socket.send(JSON.stringify(produceMessage("TYPE_HANDSHAKE", [MY_ADDRESS])));
    });
}


//to store connected sockets and addresses into one array

let opened = [], connected = [];
// I will use "opened" for holding both sockets and addresses, "connected" is for addresses only.

async function connect(address) {
    // We will only connect to the node if we haven't, and we should not be able to connect to ourself
    if (!connected.find(peerAddress => peerAddress === address) && address !== MY_ADDRESS) {
        const socket = new WS(address);

        socket.on("open", () => {
            // I will use the spread operator to include our connected nodes' addresses into the message's body and send it.
            socket.send(JSON.stringify(produceMessage("TYPE_HANDSHAKE", [MY_ADDRESS, ...connected])));

            // We should give other nodes' this one's address and ask them to connect.
            opened.forEach(node => node.socket.send(JSON.stringify(produceMessage("TYPE_HANDSHAKE", [address]))));

            // If "opened" already contained the address, we will not push.
            if (!opened.find(peer => peer.address === address) && address !== MY_ADDRESS) {
                opened.push({ socket, address });
            }

            // If "connected" already contained the address, we will not push.
            if (!connected.find(peerAddress => peerAddress === address) && address !== MY_ADDRESS) {
                connected.push(address);
            }

            // Two upper if statements exist because of the problem of asynchronous codes. Since they are running
            // concurrently, the first if statement can be passed easily, so there will be duplications.
        });

        // When they disconnect, we must remove them from our connected list.
        socket.on("close", () => {
            opened.splice(connected.indexOf(address), 1);
            connected.splice(connected.indexOf(address), 1);
        });
    }
}

PEERS.forEach(peer => connect(peer)); //establece conexión entre los pares


//To avoid losing the methods we send

class Blockchain {
    static hasValidTransactions(block, chain) {
      let gas = 0, reward = 0;
  
      block.data.forEach(transaction => {
        if (transaction.from !== MINT_PUBLIC_ADDRESS) {
          gas += transaction.gas;
        } else {
          reward = transaction.amount;
        }
      });
  
      return (
        reward - gas === chain.reward &&
        block.data.every(transaction => Transaction.isValid(transaction, chain)) &&
        block.data.filter(transaction => transaction.from === MINT_PUBLIC_ADDRESS).length === 1
      );
    }
  
    static isValid(blockchain) { //verifies the integrity of a blockchain
        for (let i = 1; i < blockchain.chain.length; i++) { //starts in the second block because the first one cant be compare with a predecesor
            const currentBlock = blockchain.chain[i];
            const prevBlock = blockchain.chain[i-1];

            if (
                currentBlock.hash !== Block.getHash(currentBlock) || 
                prevBlock.hash !== currentBlock.prevHash || 
                !Block.hasValidTransactions(currentBlock, blockchain)
            ) {
                return false;
            }
        }

        return true;
    }
  }
  
  
  