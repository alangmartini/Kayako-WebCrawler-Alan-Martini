# Kayako Web Crawler

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## About The Project

The Kayako Web Crawler is a simple program that scrapes a given URL and all it sublinks (up to a certain depth) and returns the count of occurrences of the word "kayako"
in the body of the page for each. I can be used with custom urls, words, customizable depth and as many tabs concurrently.

## Built With

The project is built with:

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Puppeteer](https://pptr.dev/)

## Getting Started

### Prerequisites

This project requires Node.js and npm installed on your machine. To install Node.js and npm, you can follow this guide: [Installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Installation

1. Clone the repo
```sh
git clone https://github.com/alangmartini/Kayako-WebCrawler-Alan-Martini.git
```

2. Install NPM packages 
```sh
npm install
```

## Usage
To use the web crawler, run the following command, replacing URL_TO_CRAWL with the URL you want to crawl.

```sh
npm run main -- -u URL_TO_CRAWL -w WORD_TO_SEARCH -d DEPTH -t TABS_TO_USE_SIMULTANEOUSLY
```

The program will then log to the console the number of occurrences of the word in the body of the page in each
link existent in the website up to the depth chosen.

## Contact
### Alan Martini
- [Linkedin](https://www.linkedin.com/in/alangmartini/)
- [Github](https://github.com/alangmartini/)
- [Email](gmartinialan@gmail.com)

Project Link: https://github.com/alangmartini/Kayako-WebCrawler-Alan-Martini

