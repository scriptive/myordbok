var {express} = require.main.exports(),
    Definition = require('./classDefinition');

const router = express.Router();
router.get('/', (req, res, next) => new Definition(req.query).search(raw => res.send(raw)));
module.exports = router;
