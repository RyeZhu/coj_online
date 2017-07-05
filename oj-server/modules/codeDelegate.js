/**
 * Created by m on 25/06/2017.
 */

const DEFAULT_TEMPLATE = {
    'java': `class Solution {
    public static void main(String[] args) {
    }
}`,
    'c++': `class Solution {
public:
    void main(int n) {
    }
};`,
    'python': `class Solution:
    def main(self, n):
        pass
`
};


let applyDelta = function (docLines, delta) {

    let row = delta.start.row;
    let startColumn = delta.start.column;
    let line = docLines[row] || "";

    switch (delta.action) {
        case "insert":
            let lines = delta.lines;
            if (lines.length === 1) {
                docLines[row] = line.substring(0, startColumn) + delta.lines[0] + line.substring(startColumn);
            } else {
                let args = [row, 1].concat(delta.lines);
                docLines.splice.apply(docLines, args);
                docLines[row] = line.substring(0, startColumn) + docLines[row];
                docLines[row + delta.lines.length - 1] += line.substring(startColumn);
            }
            break;
        case "remove":
            let endColumn = delta.end.column;
            let endRow = delta.end.row;
            if (row === endRow) {
                docLines[row] = line.substring(0, startColumn) + line.substring(endColumn);
            } else {
                docLines.splice(
                    row, endRow - row + 1,
                    line.substring(0, startColumn) + docLines[endRow].substring(endColumn)
                );
            }
            break;
    }
};

let getCodeSnap = function (language) {
    console.log("getCodeSnap language: " + language);
    if (!language) {
        language = 'java';
    }
    return DEFAULT_TEMPLATE[language.toLowerCase()];
};

let getCodeValue = function (language, cacheChangeEvents) {
    // console.log(deltas);
    // let result = DEFAULT_TEMPLATE[language.toLowerCase()].split("\n");

    let codeSnap = getCodeSnap(language);
    let result = codeSnap.split("\n");

    // console.log("before: " + JSON.stringify(result));

    for (i = 0; i < cacheChangeEvents.length; ++i) {
        let delta = JSON.parse(cacheChangeEvents[i][1]);
        applyDelta(result, delta);
    }

    // console.log("after : " + JSON.stringify(result));

    return result;
};

module.exports = {
    getCodeSnap: getCodeSnap,
    getCodeValue: getCodeValue
};