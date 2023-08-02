const {Router } = require('express')

const router = Router();

router.get("/categories", async (req, res) => {
    try {
      const categories = await Categories.find({})
      res.status(200).json({categories})
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Errro");
    }
  });


  module.exports = router;