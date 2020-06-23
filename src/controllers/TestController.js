
async function test(req, res) {
    console.log(req.io)
    return res.status(200).json({
        socket: req.connectUsers,
    })
}
export default {
    test
}