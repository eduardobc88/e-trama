import PostModel from '../module/post/model.js'
import PageModel from '../module/page/model.js'


const generatePostSlug = async (id, slug) => {
  try {
    const slugRegex = new RegExp(slug, 'i')
    let post = await PostModel.find({ 'post_slug': slugRegex, 'id': { $ne: id } })
      if(post.length)
        return `${ slug }-${ post.length}`

      return slug
  } catch (err) {
    return {
      error: err
    }
  }
}

const generatePageSlug = (id, slug) => {
  return new Promise((resolve, reject) => {
    const slugRegex = new RegExp(slug, 'i')
    PageModel.find({ 'page_slug': slugRegex, 'id': { $ne: id } })
      .then(page => {
        if (page.length)
          resolve(`${ slug }-${ page.length}`)
        else
          resolve(slug)
      })
      .catch(err => {
        reject(err)
      })
  })
}


export default {
  generatePostSlug: generatePostSlug,
  generatePageSlug: generatePageSlug,
}
