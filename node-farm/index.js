const http = require('http')
const fs = require('fs')


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%NAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%ID%}/g, product.id)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    return output
    
}

const server = http.createServer((req, res)=> {
    const pathname = req.url

    // OVERVIEW PAGE
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-Type': 'text/html'})

        const cardsHtml = dataObj.map((el)=> replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

        res.end(output)

        // Product page
    } else if(pathname === '/product'){
        res.end('This is the PRODUCT')

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