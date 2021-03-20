module.exports = {
    checkAuthToken: (req, res, next) => {
        try {
            let authToken = req.header('authorization')
            if (!authToken) {
                return res.status(401).json({
                    status: false,
                    message: 'Invalid Credential'
                })
            }
            if (authToken.split(' ')[1] == process.env.SECRET_KEY) {
                next()
            } else {
                return res.status(400).json({
                    status: false,
                    message: 'Invalid Credential',
                })
            }
        } catch (err) {
            return res.status(500).json({
                message: 'interal server error !',
                error: err.message
            })
        }
    },
}