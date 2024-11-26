/* eslint no-unused-vars: 0 */ // --> OFF

const express = require('express')
const router = express.Router()
const { Page, User, Tag } = require('../models')

// GET /wiki
router.get('/', async (req, res, next) => {
  try {
    const pages = await Page.findAll()
    res.send(pages)
  } catch (error) {
    next(error)
  }
})

// POST /wiki
router.post('/', async (req, res, next) => {
  try {
    // Step 1: Find or create the user based on name and email
    const [user, wasCreated] = await User.findOrCreate({
      where: {
        name: req.body.name,
        email: req.body.email
      }
    });

    // Step 2: Create the page with provided request data (title and content)
    const page = await Page.create(req.body);

    // Step 3: Associate the page with the user (author)
    await page.setAuthor(user);

    // Step 4: Handle tags if provided
    let tagArray = [];
    if (req.body.tags) {
      if (typeof req.body.tags === 'string') {
        // Split the string by spaces into an array
        tagArray = req.body.tags.split(' ');
      } else if (Array.isArray(req.body.tags)) {
        // Use the array as-is
        tagArray = req.body.tags;
      }

      const tags = [];
      for (const tagName of tagArray) {
        // Find or create each tag
        const [tag, wasCreated] = await Tag.findOrCreate({
          where: {
            name: tagName
          }
        });
        tags.push(tag);
      }
      // Associate the tags with the page
      await page.addTags(tags);
    }

    // Step 5: Send the created page as the response
    res.status(201).send(page);
  } catch (error) {
    next(error);  // Pass the error to the error handler middleware
  }
});



// GET /wiki/search
router.get('/search', async (req, res, next) => {
  try {
    const pages = await Page.findByTag(req.query.search)
    res.send(pages)
  } catch (error) {
    next(error)
  }
})

// PUT /wiki/:slug
router.put('/:slug', async (req, res, next) => {
  try {
    const [updatedRowCount, updatedPages] = await Page.update(req.body, {
      where: {
        slug: req.params.slug
      },
      returning: true
    })

    const tagArray = req.body.tags.split(' ')
    const tags = await Promise.all(tagArray.map(async (tagName) => {
      const [tag, wasCreated] = await Tag.findOrCreate({
        where: {
          name: tagName
        }
      })
      return tag
    }))

    await updatedPages[0].setTags(tags)

    res.send(updatedPages[0])
  } catch (error) {
    next(error)
  }
})

// DELETE /wiki/:slug
router.delete('/:slug', async (req, res, next) => {
  try {
    await Page.destroy({
      where: {
        slug: req.params.slug
      }
    })

    const pages = await Page.findAll()
    res.send(pages)
  } catch (error) {
    next(error)
  }
})

// GET /wiki/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      },
      include: [
        {
          model: Tag,
          through: { attributes: [] } // exclude join table data
        },
        {
          model: User,
          as: 'author'
        }
      ]
    })
    if (page === null) {
      res.status(404).send('Page not found')
    } else {
      res.send(page)
    }
  } catch (error) {
    next(error)
  }
})

// GET /wiki/:slug/similar
router.get('/:slug/similar', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      },
      include: [{ model: Tag }]
    })
    const tagNames = page.tags.map(tag => tag.name)
    const similars = await page.findSimilar(tagNames)
    res.send(similars)
  } catch (error) {
    next(error)
  }
})

module.exports = router
