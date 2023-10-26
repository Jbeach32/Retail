const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get("/", async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product, as: "products", through: ProductTag }],
    });

    const Tags = tagData.map((tag) => tag.get({ plain: true }));

    res.json(Tags);
  } catch (err) {
    res.status(500).json({ message: "Error." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, as: "products", through: ProductTag }], // 'as: "products"' <- your alias
    });

    if (!tagData) {
      res.status(404).json({ message: "No tag with this id." });
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const tagToUpdate = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!tagToUpdate) {
      res
        .status(404)
        .json({ message: "No tag with this id to update." });
    }
    res.status(200).json(tagToUpdate);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const tagToDelete = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json(tagToDelete);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;