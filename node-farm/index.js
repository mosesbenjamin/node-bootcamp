const http = require('http')
const fs = require('fs')


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')

const server = http.createServer((req, res)=> {
    const pathname = req.url

    if(pathname === '/' || pathname === '/overview'){
        res.end('This is the OVERVIEW')
    } else if(pathname === '/product'){
        res.end('This is the PRODUCT')
    } else if(pathname === '/api'){ 
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(data)
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