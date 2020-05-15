/**
 *          BlockchainController
 *       (Do not change this code)
 *
 * This class expose the endpoints that the client applications will use to
 * interact with the Blockchain dataset
 */
class BlockchainController {
    //The constructor receive the instance of the express.js app and the
    //Blockchain class
    constructor(app, blockchainObj) {
        this.app = app;
        this.blockchain = blockchainObj;
        // All the endpoints methods needs to be called in the constructor
        // to initialize the route.
        this.getBlockByHeight();
        this.requestOwnership();
        this.submitStar();
        this.getBlockByHash();
        this.getStarsByOwner();
        this.validateChain();
    }

    // Endpoint to Get a Block by Height (GET)
    getBlockByHeight() {
        this.app.get("/block/:height", async (req, res) => {
            if(req.params.height) {
                const height = parseInt(req.params.height);
                let block = await this.blockchain.getBlockByHeight(height);
                if(block){
                    return res.status(200).json(block);
                } else {
                    return res.status(404).send("Block Not Found!");
                }
            } else {
                return res.status(404).send("Invalid request! Check params!");
            }
        });
    }

    // Endpoint to request Ownership of a Wallet address (POST)
    requestOwnership() {
        this.app.post("/requestValidation", async (req, res) => {
            if(req.body.address) {
                const address = req.body.address;
                const message = await
                this.blockchain.requestMessageOwnershipVerification(address);
                if (message) {
                    return res.status(200).json(message);
                } else {
                    return res.status(500).send("An error happened!");
                }
            } else {
                return res.status(500).send("Check the Body Parameter!");
            }
        });
    }

    // Endpoint to submit a Star (POST)
    //You need to first `requestOwnership` to get the message to sign
    submitStar() {
        this.app.post("/submitstar", async (req, res) => {
            if( req.body.address && req.body.message &&
                req.body.signature && req.body.star) {
                const address = req.body.address;
                const message = req.body.message;
                const signature = req.body.signature;
                const star = req.body.star;
                console.log(typeof star);
                console.log(star);
                try {
                    let block = await this.blockchain.submitStar(
                        address, message, signature, star);
                    if(block){
                        return res.status(200).json(block);
                    } else {
                        return res.status(500).send("An error happened!");
                    }
                } catch (error) {
                    return res.status(500).send(error);
                }
            } else {
                return res.status(500).send("Check the Body Parameter!");
            }
        });
    }

    // Endpoint to retrieve a block by hash (GET)
    getBlockByHash() {
        this.app.get("/blockhash/:hash", async (req, res) => {
            if(req.params.hash) {
                const hash = req.params.hash;
                let block = await this.blockchain.getBlockByHash(hash);
                if (block) {
                    return res.status(200).json(block);
                } else {
                    return res.status(404).send("Block Not Found!");
                }
            } else {
                return res.status(404).send("Invalid request! Check params!");
            }
        });
    }

    // Endpoint to get validation errors in the chain (GET)
    validateChain() {
        this.app.get("/validatechain", async (req, res) => {
            try {
                let chainErrors = await this.blockchain.validateChain();
                return res.status(200).json(chainErrors);
            } catch (err) {
                return res.status(500).send(err.toString());
            }
        });
    }

    // Endpoint to request the list of Stars registered by an address (GET)
    getStarsByOwner() {
        this.app.get("/blocks/:address", async (req, res) => {
            if(req.params.address) {
                const address = req.params.address;
                try {
                    let stars = await
                    this.blockchain.getStarsByWalletAddress(address);
                    if (stars) {
                        return res.status(200).json(stars);
                    } else {
                        return res.status(404).send("No stars found!");
                    }
                } catch (error) {
                    // return res.status(500).send("An error happened!");
                    return res.status(500).send(error.toString());
                }
            } else {
                return res.status(404).send("Invalid request. Check params!");
            }
        });
    }

}

module.exports = (app, blockchainObj) => { return new BlockchainController(app, blockchainObj);}