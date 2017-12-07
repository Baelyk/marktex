import CommonMark
with open('tests/first.md', 'r') as f:
    parser = CommonMark.Parser()
    ast = parser.parse(f.read())
    json = CommonMark.dumpJSON(ast)
    print(json)
