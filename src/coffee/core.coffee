class DBFDataFileParser
  constructor: (@path_string) ->
    Parser = require('node-dbf');
    @dbpParser = new Parser(@path_string)
