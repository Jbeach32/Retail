const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get("/", async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [Category, { model: Tag, through: ProductTag }],
    });

    const products = productData.map((product) => product.get({ plain: true }));

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [Category, { model: Tag, through: ProductTag }],
    });

    const product = productData.get({ plain: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error." });
  }
});

// ...

router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });

      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const [rowsUpdated, [updatedProduct]] = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true, 
    });

    if (rowsUpdated === 0) {
      res.status(404).json({ message: "No product found with this id to update." });
      return;
    }

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });

      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productToDelete = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json(productToDelete);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;