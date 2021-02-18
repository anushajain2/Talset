exports.getTutorial = function (req, res, next) {
    try {
        const url = process.env.TUTORIAL_URL;
        return res.status(200).json({ url });
    } catch (e) {
        return next(e);
    }
}