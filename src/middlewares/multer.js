import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempPath = path.join(__dirname, "../../public/temp")
    cb(null, tempPath)
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname
    cb(null, filename)
  }
})

export const upload = multer({ storage })




// import multer from "multer"

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp")
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })

// export  const upload = multer({ storage })