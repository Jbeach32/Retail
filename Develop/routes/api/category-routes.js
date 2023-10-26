const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get("/", async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [Product],
    });

    const categories = categoryData.map((category) =>
      category.get({ plain: true })
    );

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "You have an error." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [Product],
    });

    if (!categoryData) {
      res.status(404).json({ message: "No category found with this id." });
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const categoryToUpdate = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!categoryToUpdate) {
      res
        .status(404)
        .json({ message: "Oops. No category found with this id to update." });
    }
    res.status(200).json(categoryToUpdate);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const categoryToDelete = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json(categoryToDelete);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;