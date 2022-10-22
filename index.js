const http = require('http');
const chalk = require('chalk');
const fs = require('fs');
const url = require('url');

const port = process.env.PORT || 3000;

const countries = (countryEl, template) => {
    let output = template.replace(/{%NAME%}/g, countryEl.name);
    output = output.replace(/{%FLAG%}/g, countryEl.flag);
    output = output.replace(/{%ID%}/g, countryEl.id);
    output = output.replace(/{%DESCRIPTION%}/g, countryEl.description);

    if (countryEl.de === true) {
        output = output.replace(/{%COUNTRYNAME%}/g, 'DEUTSCHLAND / GERMANY');
    } else if (countryEl.es === true) {
        output = output.replace(/{%COUNTRYNAME%}/g, 'ESPAÑA / SPAIN');
    } else if (countryEl.fr === true) {
        output = output.replace(/{%COUNTRYNAME%}/g, 'LA FRANCE / FRANCE');
    } else if (countryEl.pt === true) {
        output = output.replace(/{%COUNTRYNAME%}/g, 'PORTUGAL / PORTUGAL');
    } else (countryEl.gb === true)
        output = output.replace(/{%COUNTRYNAME%}/g, 'GREAT - BRITAIN')
    
    return output;
}

const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const objData = JSON.parse(data);
const countriesTemp = fs.readFileSync(`${__dirname}/templates/countries.html`, 'utf-8');
const indexTemp = fs.readFileSync(`${__dirname}/templates/index.html`, 'utf-8');
const countryTemp = fs.readFileSync(`${__dirname}/templates/country.html`, 'utf-8');

const server = http.createServer((req, res) => {
    
    const { query, pathname} = url.parse(req.url, true);
    console.log(query.id, pathname)

    if (pathname === '/' || pathname === '/paises') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHTML = objData.map(el => countries(el, countriesTemp)).join('');
        const html = indexTemp.replace('{%COUNTRIES%}', cardsHTML);

        res.end(html);
    } else if (pathname === '/country') {
        const countryId = objData[query.id];
        const output = countries(countryId, countryTemp);

        res.end(output);
    }

});

server.listen(port, '127.0.0.1', () => {
    console.log(chalk.blue('Servidor iniciando...'));
});
