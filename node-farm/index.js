const http = require('http')
const fs = require('fs')
const url = require('url')

const replaceTemplate = require('./modules/replaceTemplate')


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

const server = http.createServer((req, res)=> {

    const {query, pathname} = url.parse(req.url, true)


    // OVERVIEW PAGE
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-Type': 'text/html'})

        const cardsHtml = dataObj.map((el)=> replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

        res.end(output)

        // Product page
    } else if(pathname === '/product'){
        const product = dataObj[query.id]
        res.writeHead(200, {'Content-Type': 'text/html'})
        const output = replaceTemplate(tempProduct, product)

        res.end(output)

        // API
    } else if(pathname === '/api'){ 
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(data)

        // Not Found
    }else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-own-header': 'hello-there!'
        })
        res.end('<h1>Page not found!')
    }
})

server.listen(8000, '127.0.0.1', ()=> {
    console.log('Server is up on port 8000')
})