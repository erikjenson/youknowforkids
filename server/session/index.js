const router = require('express').Router();

router.get('/', (req, res, next) => {
  try {
    const game = req.session.game;
    res.json(game);
  } catch (error) {
   next(error);
  }
});

router.post('/', (req, res, next) => {
  try {
    req.session.game = req.body;
    res.send(req.session.game);
  } catch (error) {
    next(error);
  }
});

router.delete('/', (req, res, next) => {
  try {
    req.session.game = [];
    res.json(req.session.game);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
