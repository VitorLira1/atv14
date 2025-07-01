const express = require('express')
const app = express()
const PORT = 8000
const axios = require('axios')
const API_URL = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=2025-01-01&end_date=2025-07-01'
const standardPictureUrl = 'https://cdn.pixabay.com/photo/2019/08/24/11/05/planet-earth-4427436_1280.jpg'

const algorithm = (data, astroName) => {
    for (let picture of data) {
        console.log(`picture: ${picture}`)
        let expl = picture.explanation
        console.log(`expl: ${expl}`)
        if (expl.includes(astroName)) {
            return {
                'url': picture.url,
                'title': picture.title,
                'explanation': picture.explanation
            }
        }
    }
}

app.set('json spaces', 4);
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    const msg = `Hello API running on PORT ${PORT}`
    const link = `http://localhost:${PORT}`
    const flink = `\x1b[1m${link}\x1b[0m`
    console.log(msg + '\n' + flink)
})

app.get('/', async (req, res) => {
    res.render('home')
})

app.post('/show', async (req, res) => {

    try {
        const axiosResponse = await axios.get(API_URL)
        console.log(axiosResponse.data.slice(0, 2))
        const astroName = req.body.astroName
        const picture = algorithm(axiosResponse.data, astroName)
        res.render('show', 
        {   msg: axiosResponse.data, 
            astroName: astroName, 
            url:  picture.url,
            title: picture.title,
            explanation: picture.explanation 
        }
        )
    } catch (err) {
        res.send(`Erro ao acessar API: ${err.message}`)
    }
})