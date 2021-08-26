import Mock from 'mockjs'
Mock.setup({
    timeout: 10
})

Mock.mock('/getbookdata',{
    "bookdata": [
        {
            "extra" : "001",
            "bookname": "go语言",
            "author": "67",
        },
        {
            "extra" : "adf",
            "bookname": "ios开发",
            "author": "67",
        },
        {
            "extra" : "003546545646",
            "bookname": "docker开发adfdasfasdfasdfasdfadfsdafdsfdsdasfdasf",
            "author": "67",
        },
        {
            "extra" : "45",
            "bookname": "go语言",
            "author": "67",
        },
        {
            "extra" : "3wert4",
            "bookname": "ios开发",
            "author": "67",
        },
        {
            "extra" : "fd",
            "bookname": "docker开发adfdasfasdfasdfasdfadfsdafdsfdsdasfdasf",
            "author": "67",
        },
        {
            "extra" : "etw",
            "bookname": "go语言",
            "author": "67",
        },
        {
            "extra" : "002",
            "bookname": "ios开发",
            "author": "67",
        },
        {
            "extra" : "bv",
            "bookname": "docker开发adfdasfasdfasdfasdfadfsdafdsfdsdasfdasf",
            "author": "67",
        },
        {
            "extra" : "6745",
            "bookname": "go语言",
            "author": "67",
        },
        {
            "extra" : "yhg",
            "bookname": "ios开发",
            "author": "67",
        },
        {
            "extra" : "fgn",
            "bookname": "docker开发adfdasfasdfasdfasdfadfsdafdsfdsdasfdasf",
            "author": "67",
        }
    ]
})