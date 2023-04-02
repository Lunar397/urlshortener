import express from 'express'
import path from 'path'
import url from 'url';
import router from './routes/router.js'
// Declaration
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
// Middleware
app.use([express.json(), express.urlencoded({ extended:true }), express.static('../public')])

app.use('/api', router)
// Home page
app.get('/', (req, res):void => {
	res.sendFile(path.join(__dirname, '../public/urlShortener.html'))
})
app.all('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/error.html'))
})
app.listen(5000, ():void => console.log('🚀 on port 5000'))