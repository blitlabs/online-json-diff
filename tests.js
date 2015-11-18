{
  "columns":[
    {
      "exprType":"FUNCTION",
      "name":"COUNT",
      "distinct":false,
      "arguments":[
        {
          "column":"Card ID",
          "exprType":"COLUMN"
        }]
    },
    {
      "exprType":"FUNCTION",
      "name":"COUNT",
      "distinct":false,
      "arguments":[
        {
          "column":"Time",
          "exprType":"COLUMN"
        }]
    },
    {
      "exprType":"FUNCTION",
      "name":"COUNT",
      "distinct":false,
      "arguments":[
        {
          "column":"Customer",
          "exprType":"COLUMN"
        }]
    },
    {
      "exprType":"FUNCTION",
      "name":"COUNT",
      "distinct":false,
      "arguments":[
        {
          "column":"Behavior",
          "exprType":"COLUMN"
        }]
    },
    {
      "exprType":"FUNCTION",
      "name":"COUNT",
      "distinct":false,
      "arguments":[
        {
          "column":"User",
          "exprType":"COLUMN"
        }]
    }],
  "groupByColumns":[
  ],
  "orderByColumns":[
  ],
  "where":{
    "exprType":"IN",
    "leftExpr":{
      "column":"Customer",
      "exprType":"COLUMN"
    },
    "not":false,
    "selectSet":[
      {
        "exprType":"STRING_VALUE",
        "value":"domo"
      }]
  }
}




{
  "data": [{
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON API paints my bikeshed!",
      "body": "The shortest article. Ever.",
      "created": "2015-05-22T14:56:29.000Z",
      "updated": "2015-05-22T14:56:28.000Z"
    },
    "relationships": {
      "author": {
        "data": {"id": "42", "type": "people"}
      }
    }
  }],
  "included": [
    {
      "type": "people",
      "id": "42",
      "attributes": {
        "name": "John",
        "age": 80,
        "gender": "male"
      }
    }
  ]
}


{
  "glossary": {
    "title": "example glossary",
    "GlossDiv": {
      "title": "S",
      "GlossList": {
        "GlossEntry": {
          "ID": "SGML",
          "SortAs": "SGML",
          "GlossTerm": "Standard Generalized Markup Language",
          "Acronym": "SGML",
          "Abbrev": "ISO 8879:1986",
          "GlossDef": {
            "para": "A meta-markup language, used to create markup languages such as DocBook.",
            "GlossSeeAlso": [
              "GML",
              "XML"]
          },
          "GlossSee": "markup"
        }
      }
    }
  }
}


{"test":"hi there","again":"nope"}
{"test":"hi there"}
