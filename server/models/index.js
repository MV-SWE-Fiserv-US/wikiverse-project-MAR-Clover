const { Sequelize } = require('sequelize')
const { sequelize } = require('../db')

const Page = sequelize.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
    // since we are searching, editing, deleting by slug, these need to be unique
    unique: true
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('open', 'closed')
  }
})

// Page.beforeValidate((page) => {
//   /*
//    * Generate slug
//    */
//   if (!page.slug) {
//     page.slug = page.title.replace(/\s/g, '_').replace(/\W/g, '').toLowerCase()
//   }
// })
Page.beforeValidate(async (page) => {
  /*
   * Generate slug and ensure it's unique
   */
  if (!page.slug) {
    page.slug = page.title.replace(/\s/g, '_').replace(/\W/g, '').toLowerCase();
  }

  // Check if slug already exists in the database
  const existingPage = await Page.findOne({ where: { slug: page.slug } });
  if (existingPage) {
    // If slug exists, append a number to make it unique
    let counter = 1;
    let newSlug = page.slug + '-' + counter;
    while (await Page.findOne({ where: { slug: newSlug } })) {
      counter++;
      newSlug = page.slug + '-' + counter;
    }
    page.slug = newSlug;
  }
})

Page.findByTag = function (search) {
  return Page.findAll({
    include: {
      model: Tag,
      where: {
        name: {
          [Sequelize.Op.substring]: search
        }
      }
    }
  })
}

Page.prototype.findSimilar = function (tags) {
  return Page.findAll({
    where: {
      id: {
        [Sequelize.Op.ne]: this.id
      }
    },
    include: {
      model: Tag,
      where: {
        name: {
          [Sequelize.Op.in]: tags
        }
      }
    }
  })
}

const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    isEmail: true,
    allowNull: false
  }
})

const Tag = sequelize.define('tag', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

// This adds methods to 'Page', such as '.setAuthor'. It also creates a foreign key attribute on the Page table pointing ot the User table
Page.belongsTo(User, { as: 'author' })
User.hasMany(Page, { foreignKey: 'authorId' })

Page.belongsToMany(Tag, { through: 'page_tags' })
Tag.belongsToMany(Page, { through: 'page_tags' })

module.exports = {
  db: sequelize,
  Page,
  User,
  Tag
}
